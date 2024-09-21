export function formatAddress(address: string): string {
    // Split the address into parts
    const parts = address.split(',').map(part => part.trim());
  
    // Find the index of the part that contains the postcode
    const postcodeIndex = parts.findIndex(part => /\d{4}/.test(part));
  
    // If a postcode is found, keep all parts before it
    // If no postcode is found, keep all parts except the last (assuming it's the country)
    const formattedParts = postcodeIndex !== -1 ? parts.slice(0, postcodeIndex) : parts.slice(0, -1);
  
    // If 'Akaroa' is not in the formatted parts, add it
    if (!formattedParts.some(part => part.includes('Akaroa'))) {
        formattedParts.push('Akaroa');
    }
  
    // Join the remaining parts
    return formattedParts.join(', ');
}