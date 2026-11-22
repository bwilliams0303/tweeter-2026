import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import Login from "../../../src/components/authentication/login/Login";
import { LoginPresenter } from "../../../src/presenter/LoginPresenter";

jest.mock("../../../src/presenter/LoginPresenter", () => ({
  LoginPresenter: jest.fn(),
}));

describe("Login", () => {
  let mockPresenterObject: LoginPresenter;
  let aliasInput: HTMLElement;
  let passwordInput: HTMLElement;
  let signInButton: HTMLElement;

  beforeAll(() => {
    mockPresenterObject = mock<LoginPresenter>();
    const mockPresenter = instance(mockPresenterObject);
    (LoginPresenter as unknown as jest.Mock).mockImplementation(() => mockPresenter);
    when(mockPresenterObject.checkSubmitButtonStatus(anything(), anything())).thenCall(
      (alias: string, password: string) => !alias || !password
    );
  });

  beforeEach(() => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    aliasInput = screen.getByLabelText("Alias");
    passwordInput = screen.getByLabelText("Password");
    signInButton = screen.getByRole("button", { name: "Sign in" });
  });

  it("disables the sign-in button when first rendered", () => {
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button when both alias and password have text", async () => {
    await userEvent.type(aliasInput, "@allen");
    await userEvent.type(passwordInput, "password");

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign-in button when the alias or password is cleared", async () => {
    await userEvent.type(aliasInput, "@allen");
    await userEvent.type(passwordInput, "password");

    await userEvent.clear(aliasInput);
    expect(signInButton).toBeDisabled();

    await userEvent.type(aliasInput, "@allen");
    expect(signInButton).toBeEnabled();

    await userEvent.clear(passwordInput);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's doLogin with the alias, password and remember me when sign-in is pressed", async () => {
    await userEvent.type(aliasInput, "@allen");
    await userEvent.type(passwordInput, "password");

    await userEvent.click(signInButton);

    verify(mockPresenterObject.doLogin("@allen", "password", false, undefined)).once();
  });
});
