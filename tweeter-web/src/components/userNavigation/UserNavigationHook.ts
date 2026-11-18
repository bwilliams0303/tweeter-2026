import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";

export const useUserNavigation = () => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const navigate = useNavigate();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter(listener);
  }

  const navigateToUser = async (
    event: React.MouseEvent,
    featurePath: string
  ): Promise<void> => {
    event.preventDefault();

    presenterRef.current!.navigateToUser(
      authToken!,
      displayedUser!,
      event.target.toString(),
      featurePath
    );
  };

  return { navigateToUser };
};
