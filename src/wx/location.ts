import { promisify } from '../lib/util'
import { wx } from './wx'

export const getLocation = (opts: wx.GetLocationOpts): Promise<wx.GetLocationRes> =>
    promisify<wx.GetLocationRes>(opts, wx.getLocation)