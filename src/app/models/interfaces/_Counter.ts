import { Document, HydratedDocument, Model } from 'mongoose';
import { IModels } from './';
import { DocumentResult } from './ExternalDocument';

export interface CounterData {
	name: string;
	seq: number;
}
export interface ICounter
	extends CounterData,
		DocumentResult<CounterData>,
		Document {}
export interface ICounterMethods {}
export interface ICounterModel extends Model<ICounter, {}, ICounterMethods> {
	getNextSequence(modelName: string, fieldName: string): Promise<number>;
	getNextSequence(model: IModels, fieldName: string): Promise<number>;
}
export type CounterHydratedDocument = HydratedDocument<
	ICounter,
	ICounterMethods
>;
