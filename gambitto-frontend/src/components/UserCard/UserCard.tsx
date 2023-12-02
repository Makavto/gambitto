import React, { memo } from 'react';
import styles from './UserCard.module.scss';
import { IFriendshipDto } from '../../dtos/IFriendshipDto'
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';
import Button from '../Button/Button';
import Card from '../Card/Card';
import { useAppSelector } from '../../hooks/redux';

interface IUserCardProps {
  friendship: IFriendshipDto;
  onDeleteFriend: (id: number) => void;
  onAcceptFriend: (id: number) => void;
  onDeclineFriend: (id: number) => void;
}

const UserCard = memo(function UserCard({friendship, onAcceptFriend, onDeclineFriend, onDeleteFriend}: IUserCardProps) {
  const {user} = useAppSelector(state => state.userSlice)

  return (
    <Card>
      <div className={styles.friendshipCardRow}>
        <div>
          {user?.id === friendship.inviteeId ? friendship.senderName : friendship.inviteeName}
        </div>
        <div>
          {
            (friendship.friendshipStatus === 'friends' || friendship.senderId === user?.id) &&
            <Button onClick={() => onDeleteFriend(friendship.id)} type={ButtonTypesEnum.Danger}>
              Удалить друга
            </Button>
          }
          {
            friendship.friendshipStatus === 'invitation' && friendship.inviteeId === user?.id &&
            <>
            <span className={styles.button}>
              <Button onClick={() => onAcceptFriend(friendship.id)} type={ButtonTypesEnum.Primary}>
                Принять заявку
              </Button>
            </span>
            <Button onClick={() => onDeclineFriend(friendship.id)} type={ButtonTypesEnum.Danger}>
              Отклонить заявку
            </Button>
            </>
          }
        </div>
      </div>
      <div className={styles.friendshipCardRow}>
        <div>
          {friendship.friendshipStatusFormatted}
        </div>
        <div>
          {new Date(friendship.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Card>
  )
})

export default UserCard