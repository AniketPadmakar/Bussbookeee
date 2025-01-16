import styled from "styled-components";
import img from '../../images/Home.jpg';

const StyleHomepage = styled.section`
  .hm-body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-size: cover;
    background-color: #ffffff;
    background-image: url(${img});
    justify-content: center;
    display: flex;
    height: 100vh;
  }

  .home-container {
    max-width: 800px;
    margin: 50px auto;
    border: 2px solid #050046;
    padding: 60px;
    background-color: rgba(255, 255, 255, 0.1); /* More transparent background */
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }

  .module-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 20px;
  }

  .module {
    flex: 1;
    margin: 10px;
    text-align: center;
    padding: 30px;
    border: 1px solid #050046;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.9); /* More transparent background */
    transition: transform 0.3s ease-in-out;
  }

  .module:hover {
    transform: scale(1.05);
  }

  .module h2 {
    color: #333;
  }

  .module a {
    display: inline-block;
    padding: 10px 15px;
    background-color: #002750;
    color: #fff;
    text-decoration: none;
    border-radius: 6px;
    transition: background-color 0.3s ease-in-out;
    margin-top: 15px; /* Added margin for more spacing between buttons */
  }

  .module a:hover {
    background-color: #0056b3;
  }

  @media only screen and (max-width: 400px) {
    .home-container {
      padding: 20px;

      .module {
        flex: 1 0 100%;
        margin: 10px 0; /* Adjusted margin for smaller screens */
      }
  }
`;

export default StyleHomepage;
