import styles from "./UserCardWidget.module.scss";
import React from "react";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { ButtonTypesEnum } from "../../utils/ButtonTypesEnum";
import { useUserCardWidgetController } from "../../controllers/widgets/UserCard/UserCardWidgetController";
import { IFriendshipDto } from "../../dtos/IFriendshipDto";

interface IUserCardProps {
  friendship: IFriendshipDto;
}

const UserCardWidgetComponent = ({ friendship }: IUserCardProps) => {
  const { onAcceptFriend, onDeclineFriend, onDeleteFriend, user } =
    useUserCardWidgetController();

  return (
    <Card>
      <div className={styles.friendshipCardRow}>
        <div>
          {user?.id === friendship.inviteeId
            ? friendship.senderName
            : friendship.inviteeName}
        </div>
        <div>
          {(friendship.friendshipStatus === "friends" ||
            friendship.senderId === user?.id) && (
            <Button
              onClick={() => onDeleteFriend(friendship.id)}
              type={ButtonTypesEnum.Danger}
            >
              Удалить друга
            </Button>
          )}
          {friendship.friendshipStatus === "invitation" &&
            friendship.inviteeId === user?.id && (
              <>
                <span className={styles.button}>
                  <Button
                    onClick={() => onAcceptFriend(friendship.id)}
                    type={ButtonTypesEnum.Primary}
                  >
                    Принять заявку
                  </Button>
                </span>
                <Button
                  onClick={() => onDeclineFriend(friendship.id)}
                  type={ButtonTypesEnum.Danger}
                >
                  Отклонить заявку
                </Button>
              </>
            )}
        </div>
      </div>
      <div className={styles.friendshipCardRow}>
        <div>{friendship.friendshipStatusFormatted}</div>
        <div>{new Date(friendship.createdAt).toLocaleDateString()}</div>
      </div>
    </Card>
  );
};

export const UserCardWidget = React.memo(UserCardWidgetComponent);
