import { NextResponse } from 'next/server'
import { WebClient } from '@slack/web-api'

const slackToken = process.env.SLACK_BOT_TOKEN
const slackChannel = process.env.SLACK_CHANNEL_ID

const slack = new WebClient(slackToken)

export async function POST(request: Request) {
  const { orderId, customer, phone, address, items, total, deliveryCharge, specialInstructions } = await request.json()

  const formattedItems = items.map((item: { name: string; quantity: number; price: number }, index: number) => 
    `${index + 1}. ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`
  ).join('\n')

  const grandTotal = total + deliveryCharge

  const message = {
    text: `New Order #${orderId}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:new: *New Order #${orderId}*\n-----------------------`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:bust_in_silhouette: Customer: ${customer}\n:phone: Phone: ${phone}\n:round_pushpin: Address: ${address}\n-----------------------`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Order Details:*\n${formattedItems}\n-----------------------`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:moneybag: Total: $${total.toFixed(2)}\n:truck: Delivery Charge: $${deliveryCharge.toFixed(2)}\n:money_with_wings: Grand Total: $${grandTotal.toFixed(2)}\n-----------------------`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:spiral_note_pad: Special Instructions: ${specialInstructions || 'None'}`
        }
      }
    ]
  }

  try {
    // Check if the channel exists and the bot is a member
    const channelInfo = await slack.conversations.info({
      channel: slackChannel!
    })

    if (!channelInfo.channel?.is_member) {
      throw new Error('Bot is not a member of this channel')
    }

    await slack.chat.postMessage({
      channel: slackChannel!,
      ...message
    })

    return NextResponse.json({ message: 'Slack notification sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending Slack notification:', error)
    return NextResponse.json({ message: 'Failed to send Slack notification' }, { status: 500 })
  }
}