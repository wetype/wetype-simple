import { Options } from './common'
import { promisify } from '../lib/util'

export declare namespace images {

   
}

export const chooseImage = (opts: images.ChooseImageOpts): images.ChooseImageRes => promisify<images.ChooseImageRes>(opts, wx.chooseImage)