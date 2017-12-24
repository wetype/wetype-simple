export class Queue {

    queue: Promise<any>[] = []

    state: string = 'idle'

    push(p: Promise<any>) {
        this.queue.push(p)
        this.resolve()
    }

    private async resolve() {
        if (!this.queue.length) {
            this.changeState('idle')
        } else {
            this.changeState('pending')
            await this.queue[0]
            this.queue.slice(1)
            this.resolve()
        }
    }

    private changeState(state: string) {
        this.state = state
    }
}

export const queue = new Queue