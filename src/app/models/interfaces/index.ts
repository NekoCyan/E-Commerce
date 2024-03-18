import { ICartModel } from './_Cart';
import { ICategoryModel } from './_Category';
import { ICounterModel } from './_Counter';
import { IProductModel } from './_Product';
import { ISearchModel } from './_Search';
import { IUserModel } from './_User';



export type IModels = ICounterModel | IUserModel | IProductModel | ICategoryModel | ICartModel | ISearchModel;

export * from './_Cart';
export * from './_Category';
export * from './_Counter';
export * from './_Product';
export * from './_Search';
export * from './_User';




