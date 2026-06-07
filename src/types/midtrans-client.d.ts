declare module 'midtrans-client' {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    createTransaction(parameter: any): Promise<{
      token: string;
      redirect_url: string;
    }>;
  }
}
