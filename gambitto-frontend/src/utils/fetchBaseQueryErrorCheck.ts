import { IError } from "../models/IError";

export const isFetchBaseQueryErrorType = (error: any): error is IError => 'status' in error