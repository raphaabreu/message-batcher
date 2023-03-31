# MessageBatcher

The `MessageBatcher` class is a utility that helps you batch messages and process them in groups. It is useful when you want to reduce the number of operations or API calls by aggregating messages and processing them together.

## Features

- Add messages to a queue.
- Flush messages in batch when the queue reaches a certain size.
- Start an interval timer to flush messages periodically.
- Stop the interval timer.
- Stop the interval timer and flush remaining messages.

## Usage

First, install the package:

```bash
npm i @raphaabreu/message-batcher
```

Then import the `MessageBatcher` class:

```typescript
import { MessageBatcher } from '@raphaabreu/message-batcher';
```

## Creating a MessageBatcher instance

To create a new MessageBatcher instance, you need to specify the batchSize and a callback function. The batchSize determines the maximum number of messages that can be processed in one batch. The callback function is called with an array of messages when the batch is ready to be processed.

```typescript
const batchSize = 5;
const callback = async (messages: string[]) => {
  // Process messages here
};

const messageBatcher = new MessageBatcher<string>(batchSize, callback);
```

## Adding messages

You can add messages to the queue using the `add` method:

```typescript
messageBatcher.add('message1');
messageBatcher.add(['message2', 'message3']);
```

The `add` method accepts a single message or an array of messages.

## Starting the interval timer

To start the interval timer, call the `start` method and pass the `maxBatchIntervalMs` parameter:

```typescript
const maxBatchIntervalMs = 10000; // 10 seconds
messageBatcher.start(maxBatchIntervalMs);
```

The `maxBatchIntervalMs` determines the maximum interval between message batch processing.

## Stopping the interval timer

To stop the interval timer, call the `stop` method:

```typescript
messageBatcher.stop();
```

## Stopping the interval timer and flushing remaining messages

To stop the interval timer and flush any remaining messages in the queue, call the `stopAndFlush` method:

```typescript
await messageBatcher.stopAndFlush();
```

## Flushing messages manually

You can also manually flush messages using the `flush` method:

```typescript
await messageBatcher.flush();
```

This can be useful if you want to process messages immediately, without waiting for the interval timer to trigger.

## Tests

To run the provided unit tests just execute `npm run tests`.

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Support

If you have any issues or questions, please open an issue on the project repository.
