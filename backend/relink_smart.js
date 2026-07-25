const { SurveillanceSample, LabResult, sequelize } = require('./models');

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

async function relinkSmart() {
  try {
    console.log('Starting smart relink of unlinked Lab Results...');
    const results = await LabResult.findAll({ where: { sample_tracking_id: null } });
    let relinkedCount = 0;

    for (const r of results) {
      if (!r.animal_id) continue;

      const searchId = String(r.animal_id).trim();
      
      // Find all possible samples for this animal ID that don't already have a LabResult
      const possibleSamples = await SurveillanceSample.findAll({
        where: { animal_id: searchId },
        order: [['createdAt', 'ASC']]
      });

      for (const s of possibleSamples) {
        // Skip if this sample already has a lab result
        const hasResult = await LabResult.findOne({ where: { sample_tracking_id: s.tracking_id } });
        if (hasResult) continue;

        const rFarmer = (r.farmer_name || '').trim().toLowerCase();
        const sFarmer = (s.farmer_name || '').trim().toLowerCase();
        const rPhone = (r.phone || '').trim();
        const sPhone = (s.phone || '').trim();

        let isMatch = false;

        // 1. Exact phone match (if both provided)
        if (rPhone && sPhone && rPhone === sPhone) {
          isMatch = true;
        }
        
        // 2. Fuzzy name match (if phone didn't match or wasn't provided)
        if (!isMatch && rFarmer && sFarmer) {
          const dist = levenshtein(rFarmer, sFarmer);
          
          // Allow up to 3 typos, OR allow one string to be completely contained within the other
          if (dist <= 3 || rFarmer.includes(sFarmer) || sFarmer.includes(rFarmer)) {
            isMatch = true;
          }
        }

        if (isMatch) {
          console.log(`Relinking: LabResult (${rFarmer}) to Sample Tracking ID ${s.tracking_id} (${sFarmer})`);
          await r.update({ sample_tracking_id: s.tracking_id });
          relinkedCount++;
          break; // Move to the next Lab Result
        }
      }
    }

    console.log(`\nSmart Relink Complete! Successfully restored ${relinkedCount} valid Lab Results.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during relink:', error);
    process.exit(1);
  }
}

relinkSmart();
