import logo from './logo.svg';
import './App.css';
import MainRouter from './components/MainRouter/MainRouter';
import { RouterProvider } from 'react-router-dom';
import router from './components/MainRouter/MainRouter.js'

function App() {
  // let backendURL = "http://127.0.0.1:8000/";


  // async function ping(event) {
  //   let headers =
  //   {
  //     method: "GET", // *GET, POST, PUT, DELETE, etc.
  //     mode: "cors", // no-cors, *cors, same-origin
  //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //     credentials: "same-origin", // include, *same-origin, omit
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     redirect: "follow", // manual, *follow, error
  //     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //     // body: JSON.stringify(data), // body data type must match "Content-Type" header
  //   }
  //   fetch(backendURL + 'hello', headers).then(response =>
  //     response.json().then(data => {
  //       console.log(data.body)
  //     })
  //   )
  // }


  return (
    <div>
      {/* <header className="App-header">

      </header> */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
