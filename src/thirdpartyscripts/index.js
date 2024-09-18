function blockCpuFor(seconds) {
    const end = Date.now() + seconds * 1000; // Calculate the end time
    while (Date.now() < end) {
      // Busy-wait until the current time reaches the end time
    }
  }
  
  console.log('CPU blocking starts');
  blockCpuFor(5); // Block the CPU for 5 seconds
  console.log('CPU blocking ends');
  