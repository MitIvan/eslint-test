// import { FeatureFlagService } from "./featureflag.service";

// export function initializeFeatureFlag(featureFlagService: FeatureFlagService): () => Promise<boolean> {
//   return (): Promise<boolean> => {
//     return new Promise((resolve, reject) => {
//       try {
//         featureFlagService.initialize();
//         resolve(true);
//       } catch (error) {
//         reject(error);
//       }
//     });
//   };
// }