// AI-assisted: see AI-ATTRIBUTION.md
import { User, UserDto } from "tweeter-shared";

describe("User", () => {
  const userDto: UserDto = {
    firstName: "Allen",
    lastName: "Anderson",
    alias: "@allen",
    imageUrl: "https://example.com/allen.png",
  };

  it("returns a dto holding its first name, last name, alias and image url", () => {
    const user = new User("Allen", "Anderson", "@allen", "https://example.com/allen.png");

    expect(user.dto).toEqual({
      firstName: "Allen",
      lastName: "Anderson",
      alias: "@allen",
      imageUrl: "https://example.com/allen.png",
    });
  });

  it("builds a user from a dto", () => {
    const user = User.fromDto(userDto);

    expect(user).toBeInstanceOf(User);
    expect(user?.firstName).toBe("Allen");
    expect(user?.lastName).toBe("Anderson");
    expect(user?.alias).toBe("@allen");
    expect(user?.imageUrl).toBe("https://example.com/allen.png");
  });

  it("returns null when the dto is null", () => {
    expect(User.fromDto(null)).toBeNull();
  });
});
