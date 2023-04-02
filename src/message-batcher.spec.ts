import { MessageBatcher } from './message-batcher';

describe('MessageBatcher', () => {
  const batchSize = 5;
  const maxBatchIntervalMs = 1000;
  const threeMessages = ['msg1', 'msg2', 'msg3'];
  const eightMessages = ['msg1', 'msg2', 'msg3', 'msg4', 'msg5', 'msg6', 'msg7', 'msg8'];

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('flush', () => {
    test('should flush messages once batch size is reached', async () => {
      // Arrange
      const callback = jest.fn().mockImplementation(() => Promise.resolve());
      const messageBatcher = new MessageBatcher<string>(batchSize, callback);

      // Act
      eightMessages.forEach((message) => messageBatcher.add(message));

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(eightMessages.slice(0, batchSize));
    });

    test('should flush remaining messages', async () => {
      // Arrange
      const callback = jest.fn().mockImplementation(() => Promise.resolve());
      const messageBatcher = new MessageBatcher<string>(batchSize, callback);
      eightMessages.forEach((message) => messageBatcher.add(message));

      // Act
      await messageBatcher.flush();

      // Assert
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(2, eightMessages.slice(batchSize));
    });

    test('should flush messages on interval', async () => {
      // Arrange
      jest.useFakeTimers();
      const callback = jest.fn().mockImplementation(() => Promise.resolve());
      const messageBatcher = new MessageBatcher<string>(batchSize, callback);
      messageBatcher.start(maxBatchIntervalMs);
      threeMessages.forEach((message) => messageBatcher.add(message));

      // Act
      jest.advanceTimersByTime(maxBatchIntervalMs);
      await messageBatcher.flush();

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(threeMessages);
    });
  });

  describe('stopAndFlush', () => {
    test('should stop and flush remaining messages', async () => {
      // Arrange
      jest.useFakeTimers();
      const setInterval = jest.spyOn(global, 'setInterval');
      const clearInterval = jest.spyOn(global, 'clearInterval');
      const callback = jest.fn().mockImplementation(() => Promise.resolve());
      const messageBatcher = new MessageBatcher<string>(batchSize, callback);
      messageBatcher.start(maxBatchIntervalMs);
      threeMessages.forEach((message) => messageBatcher.add(message));

      // Act
      await messageBatcher.stopAndFlush();

      // Assert
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(threeMessages);
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(clearInterval).toHaveBeenCalledTimes(1);
    });
  });

  describe('batch', () => {
    test('should return an empty array if message is empty', () => {
      // Arrange

      // Act
      const result = MessageBatcher.batch([], batchSize);

      // Assert
      expect(result).toEqual([]);
    });

    test('should return a batch array if message length is less than or equal to batch size', () => {
      // Arrange

      // Act
      const result = MessageBatcher.batch(threeMessages, batchSize);

      // Assert
      expect(result).toEqual([['msg1', 'msg2', 'msg3']]);
    });

    test('should return multiple batches if message length is greater than batch size', () => {
      // Arrange

      // Act
      const result = MessageBatcher.batch(eightMessages, batchSize);

      // Assert
      expect(result).toEqual([
        ['msg1', 'msg2', 'msg3', 'msg4', 'msg5'],
        ['msg6', 'msg7', 'msg8'],
      ]);
    });

    test('should handle both single message and array of messages', () => {
      // Arrange
      const singleMessage = 'msg1';

      // Act
      const result = MessageBatcher.batch(singleMessage, batchSize);

      // Assert
      expect(result).toEqual([['msg1']]);
    });

    test('should throw an error if size is not provided', () => {
      expect(() => MessageBatcher.batch(['message'], undefined)).toThrowError('size is required');
    });

    test('should throw an error if size is not positive', () => {
      expect(() => MessageBatcher.batch(['message'], -1)).toThrowError('size must be positive');
    });
  });
});
