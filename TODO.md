BUGS
- PRODUCTS ARE CACHED when nextjs build runs (i.e deployed on vercel)
- When doing a search - the search dissapears when text is entered that does not match any products
- Our countdown is slightly out - it is calculating 60 secs for the last minute rather than checking actual seconds remaining (not a biggie)

NOTES
- check the cart is still checking inventory before submitting order:
 - need to check if inventory has reduced
 - need to check if item is now out of stock
 BUG - if only 1 product in cart that is now out of stock... don't see the message about the item being removed..

NICE TO HAVE
- email receipts - ask for email address after placing order.

ENHANCEMENTS
- Integrate analytics