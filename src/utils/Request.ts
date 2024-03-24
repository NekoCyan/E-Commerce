import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const POST = <D = any>(
	url: string,
	data?: D,
	config?: AxiosRequestConfig<D>,
): Promise<AxiosResponse<any, any>> =>
	axios.post(url, data, config).catch((e) => e?.response ?? e);

export const GET = <D = any>(
	url: string,
	config?: AxiosRequestConfig<D>,
): Promise<AxiosResponse<any, any>> =>
	axios.get(url, config).catch((e) => e?.response ?? e);

export const PUT = <D = any>(
	url: string,
	data?: D,
	config?: AxiosRequestConfig<D>,
) => axios.put(url, data, config).catch((e) => e?.response ?? e);

export const DELETE = <D = any>(
	url: string,
	config?: AxiosRequestConfig<D>,
): Promise<AxiosResponse<any, any>> =>
	axios.delete(url, config).catch((e) => e?.response ?? e);

export const PATCH = <D = any>(
	url: string,
	data?: D,
	config?: AxiosRequestConfig<D>,
): Promise<AxiosResponse<any, any>> =>
	axios.patch(url, data, config).catch((e) => e?.response ?? e);
