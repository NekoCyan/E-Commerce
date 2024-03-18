import mongoose from 'mongoose';
import {
	ICounter,
	ICounterMethods,
	ICounterModel,
	IModels,
} from './interfaces';

const CounterSchema = new mongoose.Schema<
	ICounter,
	ICounterModel,
	ICounterMethods
>({
	name: {
		type: String,
		required: [true, `name is required`],
	},
	seq: {
		type: Number,
		default: 0,
	},
});

// statics.
CounterSchema.static(
	'getNextSequence',
	async function (
		modelName: IModels | string,
		fieldName: string,
	): Promise<number> {
		if (typeof modelName === 'function') modelName = modelName.modelName;

		const counter: ICounter = await this.findOneAndUpdate(
			{ name: `${modelName}.${fieldName}` },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true },
		);
		return counter.seq;
	},
);

const Counter =
	(mongoose.models.Counter as ICounterModel) ||
	mongoose.model<ICounter, ICounterModel>('Counter', CounterSchema);

export default Counter;
