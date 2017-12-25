declare const console: any

export class Queue {

    queue: Promise<any>[] = []

    curIndex = 0

    state: string = 'idle'

    push(p: Promise<any>) {
        this.queue.push(p)
        console.log('push', p)
        return this.resolve()
    }

    private async resolve() {
        console.log('len', this.curIndex, this.queue.length)
        if ((this.curIndex + 1) > this.queue.length) {
            console.log('idle!!')
            this.changeState('idle')
        } else {
            // 若为闲置状态，则开始运行
            if (this.state === 'idle') {
                console.log('idle')
                this.changeState('pending')
                try {
                    console.group(`index: ${this.curIndex}`)
                    console.time(`index: ${this.curIndex}`)
                    await this.queue[this.curIndex]
                    console.timeEnd(`index: ${this.curIndex}`)
                    console.log(this.curIndex, this.queue)
                    console.groupEnd()
                    this.curIndex++
                    console.log('curindex', this.curIndex)
                    return this.resolve()
                } catch (e) {
                    console.log(e)
                    return this.resolve()
                }
            } else {
                console.log('pending')
            }
        }
    }

    private changeState(state: string) {
        this.state = state
    }
}

export const queue = new Queue