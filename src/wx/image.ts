import { promisify } from '../lib/util'
import { wx } from './wx'

export const chooseImage = (opts: wx.ChooseImageOpts): Promise<wx.ChooseImageRes> => 
    promisify<wx.ChooseImageRes>(opts, wx.chooseImage)