import { NextResponse } from 'next/server';

const scriptContent = `
function blockCpuFor(seconds) {
  const end = Date.now() + seconds * 1000; // Calculate the end time
  while (Date.now() < end) {
    // Busy-wait until the current time reaches the end time
  }
}

console.log('CPU blocking starts');
blockCpuFor(3); // Block the CPU for 3 seconds
console.log('CPU blocking ends');
`;

export async function GET() {
  return new NextResponse(scriptContent, {
    headers: {
      'Content-Type': 'application/javascript',
    },
  });
}
