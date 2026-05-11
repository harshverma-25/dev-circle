import dotenv from 'dotenv';
dotenv.config();
import { getAICompletion } from './src/utils/ai.service.js';

(async () => {
  try {
    const res = await getAICompletion('Testing', 'Respond with JSON {"score": 100}');
    console.log(res);
  } catch (e) {
    console.error('Script Error:', e);
  }
})();
