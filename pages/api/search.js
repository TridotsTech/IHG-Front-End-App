// // pages/api/search.js

// import client from '@/lib/typesense';

// export default async function handler(req, res) {
//   const { query } = req.query; // Extract query parameter from request

//   if (!query) {
//     return res.status(400).json({ error: 'Query parameter is required' });
//   }

//   try {
//     const searchResults = await client.collections('your_collection_name') // Replace with your collection name
//       .documents()
//       .search({
//         q: query,
//         query_by: 'title,description', // Replace with your searchable fields
//         typo_tokens_threshold: 2, // Optional: Adjust the typo tolerance
//       });

//     return res.status(200).json(searchResults);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Error during search' });
//   }
// }
