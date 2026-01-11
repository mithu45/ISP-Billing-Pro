
import { GoogleGenAI } from "@google/genai";
import { Customer, Transaction } from "../types";

// Always use the named parameter for apiKey and directly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBillingAnalysis = async (customers: Customer[], transactions: Transaction[]) => {
  const expiredCount = customers.filter(c => c.status === 'EXPIRED').length;
  const activeCount = customers.filter(c => c.status === 'ACTIVE').length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  const prompt = `
    Analyze the following ISP Billing data and provide a concise summary for the Admin:
    - Total Active Customers: ${activeCount}
    - Total Expired/Due Customers: ${expiredCount}
    - Total Collection (Current Period): ৳${totalRevenue}
    
    Provide 3 actionable tips to improve collection efficiency and reduce churn. 
    Keep the tone professional and the response formatted in Markdown.
  `;

  try {
    // Using gemini-3-flash-preview for basic text analysis as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Directly access the .text property (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate AI insights at this time.";
  }
};
