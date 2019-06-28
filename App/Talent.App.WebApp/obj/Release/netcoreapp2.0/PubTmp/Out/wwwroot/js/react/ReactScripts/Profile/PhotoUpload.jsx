import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Icon } from 'semantic-ui-react';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadStatus: {
                isUploading:false
            },
            imageUrl: '',
            imageId: '',
            image:''

        }
        this.previewImage = this.previewImage.bind(this)
        this.handleUploadBtn = this.handleUploadBtn.bind(this)
        this.checkValidFileType = this.checkValidFileType.bind(this)
        this.upload=this.upload.bind(this)

    };

    handleUploadBtn(e) {
        debugger;
        e.preventDefault()
        if (!this.state.imageUrl)
            return TalentUtil.notification.show(
                'Please upload a picture first',
                'error',
                null,
                null
            )
        if (this.state.imageUrl === this.state.imageId) return

       this.upload()
    }
    checkValidFileType(file) {
        if (!file) return false
        const fileName = file.name
        const extension = fileName.split('.')[fileName.split('.').length - 1]
        const allowedFileTypes = ['jpg', 'jpeg', 'gif', 'png']
        return allowedFileTypes.includes(extension)
    }

    upload() {
        
        this.setState({ uploadStatus: { isUploading: true } })
        const cookies = Cookies.get('talentAuthToken')
        const data = new FormData()
        data.append('files', this.state.image)

        $.ajax({
            url: this.props.savePhotoUrl,
            headers: {
                Authorization: 'Bearer ' + cookies
            },
            processData: false,
            contentType: false,
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show(
                        'Profile updated sucessfully',
                        'success',
                        null,
                        null
                    )
                    this.setState({ uploadStatus: { isUploading: false, isSuccess: true } })
                } else {
                    TalentUtil.notification.show(
                        'Profile did not update successfully',
                        'error',
                        null,
                        null
                    )
                    this.setState({ uploadStatus: { isUploading: false, isSuccess: false } })
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }


    previewImage(e) {
        
        e.preventDefault()
        const image = e.target.files[0]
        const isFileValid = this.checkValidFileType(image)

        if (!isFileValid)
            return TalentUtil.notification.show(
                'Invalid file type',
                'error',
                null,
                null
            )
        this.setState({
            imageUrl: URL.createObjectURL(image),
            image:image
        })
       // setImageUrl(URL.createObjectURL(image))
        //setImage(image)
    }

    render() {
        
        let imageUrl = this.props.imageId? this.props.imageId:this.state.imageUrl
        
        return (<div className="row">
            <div
                className="ui sixteen wide column"
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <label
                    className="file-upload"
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'
                    }}
                >
                    {!imageUrl && <Icon size="huge" name="camera retro" />}
                    <input
                        disabled={this.state.uploadStatus.isUploading}
                        type="file"
                        onChange={this.previewImage}
                    />
                </label>
                <button loading={this.state.uploadStatus.isUploading}
                    disabled={this.state.uploadStatus.isUploading}
                    onClick={this.handleUploadBtn}
                    color="black" type="button" className="ui right floated teal button"><Icon name="upload" />Upload</button>
            </div>
        </div>)

    }
}

//{ !this.state.imageUrl && <Icon size="huge" name="camera retro" /> }

/* Photo upload section */
//import React, { useState, useEffect } from 'react'
//import Cookies from 'js-cookie'
//import { Image, Button, Icon, Input, Label } from 'semantic-ui-react'

//const PhotoUpload = ({ imageId, savePhotoUrl }) => {
//    const [imageUrl, setImageUrl] = useState(() => imageId)
//    const [image, setImage] = useState(() => null)
//    const [uploadStatus, setUploadStatus] = useState(() => ({
//        isUploading: false,
//        isSuccess: false
//    }))

//    useEffect(
//        () => {
//            if (imageId) setImageUrl(imageId)
//        },
//        [imageId]
//    )

//    const checkValidFileType = file => {
//        if (!file) return false
//        const fileName = file.name
//        const extension = fileName.split('.')[fileName.split('.').length - 1]
//        const allowedFileTypes = ['jpg', 'jpeg', 'gif', 'png']
//        return allowedFileTypes.includes(extension)
//    }

//    const previewImage = e => {
//        e.preventDefault()
//        const image = e.target.files[0]
//        const isFileValid = checkValidFileType(image)

//        if (!isFileValid)
//            return TalentUtil.notification.show(
//                'Invalid file type',
//                'error',
//                null,
//                null
//            )
//        setImageUrl(URL.createObjectURL(image))
//        setImage(image)
//    }

//    const handleUploadBtn = e => {
//        e.preventDefault()
//        if (!imageUrl)
//            return TalentUtil.notification.show(
//                'Please upload a picture first',
//                'error',
//                null,
//                null
//            )
//        if (imageUrl === imageId) return

//        upload()
//    }

//    const upload = () => {
//        setUploadStatus({ ...uploadStatus, isUploading: true })
//        const cookies = Cookies.get('talentAuthToken')
//        const data = new FormData()
//        data.append('files', image)

//        $.ajax({
//            url: savePhotoUrl,
//            headers: {
//                Authorization: 'Bearer ' + cookies
//            },
//            processData: false,
//            contentType: false,
//            type: 'POST',
//            data: data,
//            success: function (res) {
//                if (res.success == true) {
//                    TalentUtil.notification.show(
//                        'Profile updated sucessfully',
//                        'success',
//                        null,
//                        null
//                    )
//                    setUploadStatus({ isUploading: false, isSuccess: true })
//                } else {
//                    TalentUtil.notification.show(
//                        'Profile did not update successfully',
//                        'error',
//                        null,
//                        null
//                    )
//                    setUploadStatus({ isUploading: false, isSuccess: false })
//                }
//            }.bind(this),
//            error: function (res, a, b) {
//                console.log(res)
//                console.log(a)
//                console.log(b)
//            }
//        })
//    }
//    return (
//        <div className="row">
//            <div
//                className="ui sixteen wide column"
//                style={{ display: 'flex', flexDirection: 'column' }}
//            >
//                <label
//                    className="file-upload"
//                    style={{
//                        backgroundImage: `url(${imageUrl})`,
//                        backgroundPosition: 'center',
//                        backgroundRepeat: 'no-repeat',
//                        backgroundSize: 'cover'
//                    }}
//                >
//                    {!imageUrl && <Icon size="huge" name="camera retro" />}
//                    <input
//                        disabled={uploadStatus.isUploading}
//                        type="file"
//                        onChange={previewImage}
//                    />
//                </label>
//                <Button
//                    loading={uploadStatus.isUploading}
//                    disabled={uploadStatus.isUploading}
//                    onClick={handleUploadBtn}
//                    color="black"
//                >
//                    <Icon name="upload" />Upload
//        </Button>
//            </div>
//        </div>
//    )
//}







/* Photo upload section 
import React, { Component } from 'react';
import Cookies from 'js-cookie';


export default class PhotoUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { file: '', imagePreviewUrl: '', showPreview:true };
    }

    handleSubmit(e) {
        debugger;
        e.preventDefault();
        // TODO: do something with -> this.state.file
        console.log('handle uploading-', this.state.file);

        //this.props.updateProfileData({
        //    profilePhoto: this.state.file
            
        //})
        const cookies = Cookies.get('talentAuthToken')
        const data = new FormData()
        data.append('files', this.state.file)

        $.ajax({
            url:this.props.savePhotoUrl,
            headers: {
                Authorization: 'Bearer ' + cookies
            },
            processData: false,
            contentType: false,
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.success == true) {
                    this.setState({
                        showPreview:false
                    })
                    TalentUtil.notification.show(
                        'Profile updated sucessfully',
                        'success',
                        null,
                        null
                    )
                   
                } else {
                    TalentUtil.notification.show(
                        'Profile did not update successfully',
                        'error',
                        null,
                        null
                    )
                  
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })




    }

    handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)
    }

    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;

        imagePreviewUrl = this.props.imageId? this.props.imageId: this.state.imagePreviewUrl

        if (imagePreviewUrl && this.state.showPreview) {
            $imagePreview = (<img src={imagePreviewUrl} />);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }

        return (
            <div className="previewComponent">
                    <input className="fileInput"
                        type="file"
                        onChange={(e) => this.handleImageChange(e)} />
                    <button className="submitButton"
                        type="submit"
                        onClick={(e) => this.handleSubmit(e)}>Upload Image</button>
                <div className="imgPreview">                    
                    {$imagePreview}                   
                </div>
            </div>
        )
    }
}



//export default class PhotoUpload extends Component {

//    constructor(props) {
//        super(props);


//    };




//    render() {
//        return (<div></div>)

//    }
//}*/