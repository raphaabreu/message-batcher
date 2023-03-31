export class MessageBatcher<T> {
  private queue: T[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private timer: any;

  constructor(private readonly batchSize: number, private readonly callback: (messages: T[]) => Promise<void> | void) {
    if (!callback) {
      throw new Error('callback is required');
    }
    if (!batchSize) {
      throw new Error('size is required');
    }
    if (!(batchSize > 0)) {
      throw new Error('size must be positive');
    }
  }

  public start(maxBatchIntervalMs = 10000): void {
    if (!maxBatchIntervalMs) {
      throw new Error('maxBatchIntervalMs is required');
    }
    if (!(maxBatchIntervalMs > 0)) {
      throw new Error('maxBatchIntervalMs must be greater than 0');
    }

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.flush();
    }, maxBatchIntervalMs);
  }

  public add(message: T | T[]): void {
    const asArray = Array.isArray(message) ? message : [message];

    this.queue.push(...asArray);
    while (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  public async flush(): Promise<void> {
    if (this.queue.length > 0) {
      const messagesToSend = this.queue.splice(0, Math.min(this.batchSize, this.queue.length));
      await this.callback(messagesToSend);
    }
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  public async stopAndFlush(): Promise<void> {
    this.stop();
    await this.flush();
  }
}
