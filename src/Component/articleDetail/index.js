import React from 'react';
import '../../static/style.css'
import {ArticleModel,UserModel} from '../dataModel';
import {dateDiff} from '../../Tools'
class ArticleDetail extends React.Component{
    constructor(props){
        super(props);
        this.state={
            commentList:[],
            article:'',
            author:'',
            comment:[]
        }
    }
    componentDidMount(){
        let article_id = this.props.params.id;
        ArticleModel.fetchArticle(article_id,(data)=>{
            this.setState({
                article:data.content,
                author:data.content.author,
                comment:data.content.comments
            })
        },(err)=>{
            console.log(err)
        })
    }
    commentList(){
        let commentList = this.state.comment.map(function (item,index) {
            var reactId = 0;
            return(
                <li className="row" key={index}>
                    <div className="col-15" style={{padding:'0.3rem 0'}}>
                        <img className="commentAvatar" src={item.avatar} alt=""/>
                    </div>
                    <div className="col-85 commentList">
                        <div style={{fontWeight:'600'}}>{item.username}</div>
                        <p style={{margin:'0.2rem 0'}}>{item.comment}</p>
                        <div style={{fontSize:'12px'}}><span className="icon icon-clock"> </span> {dateDiff(item.createAt)}</div>
                    </div>
                </li>
            )
        })

        return(
            <ul>
                {commentList}

            </ul>
        )
    }
    checkLogin(){
       var usertoken = UserModel.fetchToken()
        if(!usertoken){
           $.alert('您还没有登录')
        }
        return
    }
    handleComment(){
        let comment = this.refs.commentText.value;
        let articleId = this.props.params.id;
        let userId = UserModel.fetchToken();
        let params = {
            userId:userId,
            articleId:articleId,
            comment:comment
            }
        ArticleModel.comment(params,(data)=>{
            console.log(data);
            $.toast(data.content);
            this.refs.commentText.value='';
            this.componentDidMount();
        },(err)=>{
            console.log(err)
        })
    }
    render(){
        return(
            <div>

            <main className="detailContent">
                <h2 className="clearPt">{this.state.article.title}</h2>
                <div>
                    <span className="font12 marR">作者:{this.state.author.username}</span>
                    <span className="font12">发表于:{dateDiff(this.state.article.createAt)}</span>
                </div>
                <hr/>
                <div className="article">
                    {this.state.article.content}
                </div>
                <hr/>
                <div>
                    <h3 className="clearPt">评论:</h3>
                    {this.commentList()}
                </div>
            </main>
                <div className="comment row no-gutter" style={{margin:'none'}}>
                    <input type="text" ref="commentText" className="col-75 commentInput" placeholder="说点什么吧" onChange={this.checkLogin}/>
                    <a onClick={()=>{this.handleComment()}} className="button col-25 button-fill button-big">评论</a>
                </div>
            </div>

        )
    }
}
export default ArticleDetail;