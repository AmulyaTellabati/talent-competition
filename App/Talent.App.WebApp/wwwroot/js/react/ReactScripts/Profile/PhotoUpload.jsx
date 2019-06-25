/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';


export default class PhotoUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { file: '', imagePreviewUrl: '', showPreview:true };
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log('handle uploading-', this.state.file);
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
//}