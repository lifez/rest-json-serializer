interface FnField {
  (instance?: any): { key: string; value: any };
}

export class BaseSerializer {
  protected instance: any;
  protected exclude: string[];
  protected defaultValue: Record<string, any>;
  protected renameFields: { from: string; to: string }[];
  protected methodFields: FnField[];
  constructor({
    instance,
    exclude = [],
    defaultValue = {},
    renameFields = [],
    methodFields = [] as FnField[],
  }: {
    instance: any;
    exclude?: string[];
    defaultValue?: Record<string, any>;
    renameFields?: { from: string; to: string }[];
    methodFields?: FnField[];
  }) {
    this.instance = instance;
    this.exclude = exclude;
    this.defaultValue = defaultValue;
    this.renameFields = renameFields;
    this.methodFields = methodFields;
  }

  serialize(): Record<string, any> {
    const data: Record<string, any> = {};
    Object.keys(this.instance).forEach((key) => {
      if (!this.exclude.includes(key)) {
        data[key] =
          this.instance[key] !== null
            ? this.instance[key]
            : this.defaultValue.hasOwnProperty(key)
            ? this.defaultValue[key]
            : null;
      }
    });

    this.methodFields.forEach((method) => {
      const result = method(this.instance);
      data[result.key] = result.value;
    });

    return this.renameFields.length ? this.doRename(data) : data;
  }

  private doRename(data: Record<string, any>): Record<string, any> {
    const copyData = { ...data };
    for (const field of this.renameFields) {
      copyData[field.to] = copyData[field.from];
      delete copyData[field.from];
    }
    return copyData;
  }
}
