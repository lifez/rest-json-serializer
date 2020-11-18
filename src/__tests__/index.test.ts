import { BaseSerializer, BaseSerializerFnReturnType } from "../index";

describe("Base Serializer", () => {
  const instance: Record<string, any> = {
    firstName: "Carlo",
    lastName: "Bayer",
    email: "a@a.com",
    address: null,
  };
  it("should return default value of specific key if defaultValue is set and instance data is null", async () => {
    const serializer = new BaseSerializer({
      instance,
      defaultValue: { address: "Earth" },
    });
    const expected = await serializer.serialize();
    expect(expected.address).toEqual("Earth");
  });

  it("should not expose field in exclude list to the return value", async () => {
    const serializer = new BaseSerializer({
      instance,
      exclude: ["address"],
    });
    const expected = await serializer.serialize();

    expect(expected.address).toBeUndefined();
  });
  it("should rename field from A to B if construct with renameFields args", async () => {
    const serializer = new BaseSerializer({
      instance,
      renameFields: [{ from: "firstName", to: "name" }],
    });
    const expected = await serializer.serialize();

    expect(expected.firstName).toBeUndefined();
    expect(expected.name).toBe("Carlo");
  });

  it("should execute function in methodFields and expose in serialized field and value", async () => {
    const return1Function = () => {
      return { key: "customField", value: 1 };
    };
    const serializer = new BaseSerializer({
      instance,
      methodFields: [return1Function],
    });

    const expected = await serializer.serialize();
    expect(expected.customField).toEqual(1);
  });

  it("should take instance as an argument and execute function in methodFields and expose in serialized field and value", async () => {
    const returnNameFunction = (instance: any) => {
      return {
        key: "name",
        value: `${instance["firstName"]} ${instance["lastName"]}`,
      };
    };
    const returnNameAndEmailFunction = (instance: any) => {
      return {
        key: "name_and_email",
        value: `${instance["firstName"]} ${instance["lastName"]} ${instance["email"]}`,
      };
    };
    const serializer = new BaseSerializer({
      instance,
      methodFields: [returnNameFunction, returnNameAndEmailFunction],
    });

    const expected = await serializer.serialize();
    expect(expected.name).toEqual("Carlo Bayer");
    expect(expected.name_and_email).toEqual("Carlo Bayer a@a.com");
  });

  it("should able to use methodField that use instance attribute which we exclude", async () => {
    const returnNameFunction = (instance: any) => {
      return {
        key: "name",
        value: `${instance["firstName"]} ${instance["lastName"]}`,
      };
    };
    const serializer = new BaseSerializer({
      instance,
      exclude: ["firstName"],
      methodFields: [returnNameFunction],
    });

    const expected = await serializer.serialize();
    expect(expected.name).toEqual("Carlo Bayer");
    expect(expected.firstName).toBeUndefined();
  });
  it("should able to execute and resolve Promise methodField", async () => {
    const returnNameFunction = (
      instance: any
    ): Promise<BaseSerializerFnReturnType> => {
      return new Promise((resolve) =>
        resolve({
          key: "name",
          value: `${instance["firstName"]} ${instance["lastName"]}`,
        })
      );
    };
    const serializer = new BaseSerializer({
      instance,
      exclude: ["firstName"],
      resolveMethodFields: [returnNameFunction],
    });

    const expected = await serializer.serialize();
    expect(expected.name).toEqual("Carlo Bayer");
    expect(expected.firstName).toBeUndefined();
  });
});
