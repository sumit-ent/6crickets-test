function isCameraSetSufficient(desiredCharacteristics, hardwareCameras) {
  const { distanceRange: desiredDistance, lightLevelRange: desiredLight } = desiredCharacteristics;

  // Helper function to merge ranges
  function mergeRanges(ranges) {
    ranges.sort((a, b) => a[0] - b[0]); // Sort ranges by start value
    const merged = [];
    for (const range of ranges) {
      if (merged.length === 0 || merged[merged.length - 1][1] < range[0]) {
        merged.push(range); // No overlap, add new range
      } else {
        merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], range[1]); // Merge overlapping ranges
      }
    }
    return merged;
  }

  // Helper function to check if a range is fully covered
  function isRangeCovered(desiredRange, mergedRanges) {
    for (const range of mergedRanges) {
      if (range[0] <= desiredRange[0] && range[1] >= desiredRange[1]) {
        return true; // Desired range is fully covered
      }
    }
    return false;
  }

  // Extract and merge distance ranges
  const distanceRanges = hardwareCameras.map((camera) => camera.distanceRange);
  const mergedDistanceRanges = mergeRanges(distanceRanges);

  // Extract and merge light level ranges
  const lightLevelRanges = hardwareCameras.map((camera) => camera.lightLevelRange);
  const mergedLightLevelRanges = mergeRanges(lightLevelRanges);

  // Check if both distance and light level ranges are fully covered
  const isDistanceCovered = isRangeCovered(desiredDistance, mergedDistanceRanges);
  const isLightCovered = isRangeCovered(desiredLight, mergedLightLevelRanges);

  return isDistanceCovered && isLightCovered;
}

// Example usage:
const desiredCharacteristics = {
  distanceRange: [1, 10],
  lightLevelRange: [100, 500],
};

const hardwareCameras = [
  { distanceRange: [1, 5], lightLevelRange: [100, 300] },
  { distanceRange: [5, 10], lightLevelRange: [300, 500] },
];

console.log(isCameraSetSufficient(desiredCharacteristics, hardwareCameras)); // Output: true