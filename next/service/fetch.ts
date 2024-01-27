import CustomError from "./customerror";

export default class FetchClass {
  private static instance: FetchClass;

  private constructor() {}

  public static getInstance(): FetchClass {
    if (!FetchClass.instance) {
      FetchClass.instance = new FetchClass();
    }
    return FetchClass.instance;
  }

  async runFetch(url: string, options: any) {
    try {
      this.validation(url);

      const res = await fetch(url, options);
      const data = await res.json();
      return data;
    } catch (error: any) {
      if (error.at === undefined) {
        throw new CustomError(
          "FetchClass.validation error occurred",
          error.message
        );
      }
      throw error;
    }
  }

  validation(params: string) {
    try {
      if (params === undefined || params === null) {
        const error = new CustomError("Is Invalid Url is requested");

        error.at = "FetchClass.validation";

        throw error;
      }
    } catch (error: any) {
      if (error.at === undefined) {
        throw new CustomError(
          "FetchClass.validation error occurred",
          error.message
        );
      }
      throw error;
    }
  }
}
