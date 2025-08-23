/**
 * Lazy loader for expensive dependencies
 */
export class LazyLoader<T> {
  private factory: () => T;
  private instance: T | null = null;
  private isLoading = false;
  private loadPromise: Promise<T> | null = null;

  /**
   * Creates a new LazyLoader instance
   * @param factory Factory function to create the instance
   */
  constructor(factory: () => T) {
    this.factory = factory;
  }

  /**
   * Gets the instance, creating it if necessary
   * @returns The instance
   */
  get(): T {
    if (this.instance === null) {
      this.instance = this.factory();
    }
    return this.instance;
  }

  /**
   * Gets the instance asynchronously, creating it if necessary
   * @param asyncFactory Async factory function to create the instance
   * @returns Promise resolving to the instance
   */
  static async getAsync<U>(asyncFactory: () => Promise<U>): Promise<U> {
    const loader = new LazyLoader<Promise<U>>(() => asyncFactory());
    return loader.get();
  }

  /**
   * Checks if the instance has been created
   * @returns True if the instance has been created
   */
  isLoaded(): boolean {
    return this.instance !== null;
  }

  /**
   * Resets the loader, forcing the instance to be recreated on next get()
   */
  reset(): void {
    this.instance = null;
    this.isLoading = false;
    this.loadPromise = null;
  }

  /**
   * Gets the instance asynchronously, creating it if necessary
   * This method ensures that only one instance is created even with concurrent calls
   * @returns Promise resolving to the instance
   */
  async getAsync(): Promise<T> {
    if (this.instance !== null) {
      return this.instance;
    }

    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = Promise.resolve().then(() => {
      const instance = this.factory();
      this.instance = instance;
      this.isLoading = false;
      return instance;
    });

    return this.loadPromise;
  }
}
