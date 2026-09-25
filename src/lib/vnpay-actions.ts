"use server";

import { createVnpayPaymentUrl, verifyVnpaySignature } from "./vnpay";

export async function createVnpayUrlAction(input: {
  orderNumber: string;
  amount: number;
  transactionRef: string;
}) {
  try {
    console.log("--- VNPAY DEBUG ACTION ---");
    console.log("TMN_CODE:", process.env.VNPAY_TMN_CODE);
    console.log("HASH_SECRET:", process.env.VNPAY_HASH_SECRET);
    console.log("PAYMENT_URL:", process.env.VNPAY_PAYMENT_URL);
    console.log("RETURN_URL:", process.env.VNPAY_RETURN_URL);
    console.log("--------------------------");

    const url = createVnpayPaymentUrl({
      orderNumber: input.orderNumber,
      amount: input.amount,
      transactionRef: input.transactionRef,
    });
    return { ok: true as const, url };
  } catch (err: any) {
    return { ok: false as const, error: err.message || "Failed to create VNPAY payment URL." };
  }
}

export async function verifyVnpayResponseAction(searchParamsString: string) {
  try {
    const params = new URLSearchParams(searchParamsString);
    const isValid = verifyVnpaySignature(params);
    const responseCode = params.get("vnp_ResponseCode") || "";
    const orderNumber = params.get("vnp_TxnRef") || "";
    const amountRaw = params.get("vnp_Amount") || "0";
    const amount = Math.round(Number(amountRaw) / 100);

    return {
      ok: true as const,
      isValid,
      responseCode,
      orderNumber,
      amount,
    };
  } catch (err: any) {
    return { ok: false as const, error: err.message || "Failed to verify VNPAY response." };
  }
}
