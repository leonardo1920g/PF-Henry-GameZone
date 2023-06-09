import React, { useState,useEffect } from 'react';
import { useSelector} from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import style from './UpdateData.module.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { emailUser } from '../../redux/actions';
import { useAuth0 } from '@Auth0/auth0-react';
import { useDispatch } from 'react-redux';

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET_NAME = import.meta.env.VITE_UPLOAD_PRESET_NAME;
const cookies = new Cookies();


const UpdateData = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const estadoEmail= useSelector((state)=>state.emailUser)
  const { email } = useParams();

  
  useEffect(() => {
    dispatch(emailUser(email));
    
  }, [dispatch, email]);

  const { user, isAuthenticated } = useAuth0();
  
  const [uploadedImageUrl, setUploadedImageUrl] = useState();
  console.log(estadoEmail);

  const {
    image,
    name,
    password,
    phone,
    surname } = estadoEmail.variable;

  const [data, setData] = useState({
    name: name,
    surname: surname,
    image: image,
    phone: phone,
    email: estadoEmail.email,
    password: password
  });

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET_NAME);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    setUploadedImageUrl(response.data.secure_url);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  console.log(data)
  const submitHandler =  async (event) => {
    event.preventDefault();
    await axios.put(`http://localhost:3001/user/${email}`,{ ...data, image:uploadedImageUrl});
    setData({
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      email: email,
      password: data.password
    });
    
    history.push("/");
  };
 ;
  
  return (
    <div className={style.user}>
      <div className={style.registration}>
        <div className={style.container}>
          <header>Update your data</header>
          <br />

          <div>
            <div {...getRootProps()} className={style.fields1} >
              <input {...getInputProps()}/>
              {uploadedImageUrl ? (
                <div className={style.conteinerImg}>
                  <img src={uploadedImageUrl} alt="Uploaded image, please click on Record Data" className={style.img} />
                </div>
              ) : (
                <p className={style.drop}><p className={style.textDrop}>Click here to load an image</p></p>
              )}
            </div>
            <br></br>
          </div>

          <form onSubmit={submitHandler}>
            <div className={style.formFirst}>
              <div className={style.detailsPersonal}>
                <span className={style.title}>Personal Details</span>
                <div className={style.fields}>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      value={data.name}
                      placeholder={cookies.get('name')}
                      name="name"                      
                      onChange={changeHandler}
                    ></input>
                  </div>
                  <div>
                    <label>Surname</label>
                    <input
                      type="text"
                      value={data.surname}
                      placeholder={cookies.get('surname')}
                      name="surname"                      
                      onChange={changeHandler}
                    ></input>
                  </div>
                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      value={data.phone}
                      placeholder={cookies.get('phone')}
                      name="phone"                      
                      onChange={changeHandler}
                    ></input>
                  </div>
                  
                  <div>
                    <label>Email</label>
                    <input

                      type="email"
                      value={data.email}
                      placeholder="Enter your email"
                      required
                      name="email"
                      onChange={changeHandler}
                    ></input>
                  </div>
                  
                </div>
                <div className={style.containerButton}>
                  {/* <button className={style.button} type="submit">
                    Record Data
                    <ion-icon name="person-add-outline" className={style.icon}></ion-icon>
                  </button> */}
                  <button className={style.iconRegisterButton}>register data <p className={style.guion}>__</p>      <i className="fas fa-user">  </i></button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateData;

