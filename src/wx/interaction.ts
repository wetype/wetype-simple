import { promisify } from '../lib/util'
import { wx } from './wx'

export const showModal = (opts: wx.ShowModalOpts): Promise<wx.ShowModalRes> =>
    promisify<wx.ShowModalRes>(opts, wx.showModal)