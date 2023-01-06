import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Header = ({ user }) => {
  return (
    <>
      <Row>
        <Col>
          <Link to='/'><div>Home</div></Link>
        </Col>
        {
          !user &&
          <Col>
            <Link to='/login'><div>Log in</div></Link>
          </Col>
        }
        {
          user &&
          <Col>
            <Link to='/'>
              <div onClick={() => fetch(`api/user/logout`, { method: 'DELETE' })}>Log out</div>
            </Link>
          </Col>
        }
        {
          user &&
          <Col>
            <Link to='/chat'><div>Chats</div></Link>
          </Col>
        }
      </Row>
    </>
  )
}

export default Header;