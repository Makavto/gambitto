import React, { useEffect } from 'react'
import { UserAPI } from '../../services/UserService'
import { useSearchParams } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { useForm } from 'react-hook-form';
import Card from '../../components/Card/Card';

function UserSearchPage() {

  const [getUsers, {data: usersData, isFetching: isUsersDataFetching}] = UserAPI.useLazyGetUsersQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  const {register} = useForm<{searchQuery: string}>();

  useEffect(() => {
    getUsers({searchQuery: searchParams.get('searchQuery') ?? ''})
  }, [searchParams.get('searchQuery')])

  const onSearch = (value: string) => {
    setSearchParams({searchQuery: value});
  }
  return (
    <div>
      <div className='textBig'>Поиск пользователей</div>
      <Input name='searchQuery' registerField={register} placeholder='Найти пользователя' onChange={onSearch}/>
      {
        isUsersDataFetching && <div>Загрузка...</div>
      }
      {
        usersData?.length === 0 && <div>Пользователей не найдено</div>
      }
      {
        usersData &&
        usersData.map((user, i) => (
          <div key={i}>
            <Card>
              <div>
                {
                  user.username
                }
              </div>
            </Card>
          </div>
        ))
      }
    </div>
  )
}

export default UserSearchPage