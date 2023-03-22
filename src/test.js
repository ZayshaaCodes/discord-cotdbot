function calculateMRR(D, DOC, FR, RPM) {
    const surfaceInchesPerMin = RPM * Math.PI * D;
    const MRR = DOC * FR * surfaceInchesPerMin;
    return MRR;
  }
  
  // Example usage:
  const diameter = 4; // inches
  const depthOfCut = 0.1; // inches
  const feedRate = 0.01; // inches per revolution
  const spindleSpeed = 500; // revolutions per minute
  
  const MRR = calculateMRR(diameter, depthOfCut, feedRate, spindleSpeed);
  console.log(`Material Removal Rate: ${MRR.toFixed(2)} cubic inches per minute`);
  