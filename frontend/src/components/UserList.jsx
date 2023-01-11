import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [username, setUsername] = useState([]);

  const handleSearchUser = async (e) => {
    setUsername(e.target.value);
    console.log(username);
    await fetch(
      `/api/user/search?limit=15&searchValue=${username}`,
      {
        method: 'GET'
      }
    )
      .then((res) => res.json())
      .then((data) => setUserList(data.result))
      .catch((err) => console.log(err.message));
  }

  useEffect(() => {
    const getUsers = async () => {
      await fetch(
        'api/user?limit=15',
        {
          method: 'GET'
        }
      )
        .then((res) => res.json())
        .then((data) => setUserList(data.result))
        .catch((err) => console.log(err.message));
    }

    getUsers();
  }, []);

  return (
    <>
      <Card className='p-2 m-2'>
        <Form className='p-2 m-2'>
          <Form.Group>
            <Form.Control
              className='my-2'
              type='text'
              name='username'
              value={username}
              placeholder='Search...'
              onChange={(event) => handleSearchUser(event)}
            />
          </Form.Group>
        </Form>
        <ListGroup className='p-2 m-2 usersListGroup'>
          {
            userList.length > 0 && userList.map((user, id) => (
              <Row key={id}>
                <Col>
                  <ListGroup.Item className='usersListGroupItem'>{user.username}</ListGroup.Item>
                </Col>
              </Row>
            ))
          }
        </ListGroup>
      </Card>
    </>
  );
}

export default UserList;