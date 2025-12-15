// services/geminiService.ts
export async function parseContractWithGemini(file: File) {
  console.log("Gemini parsing placeholder for file:", file.name);

  // Simulate processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: file.name, // use the file name as contract name
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        lineItems: [
          { productName: "Sample Product", quantity: 1, unitPrice: 100 }
        ]
      });
    }, 1000); // wait 1 second to simulate processing
  });
}
