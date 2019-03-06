import React, { Component } from 'react'
import Profile from './Profile';
import EditProfile from './EditProfile';
import Item from './Item';
import Language from './Language';
import ListItem from './ListItem';
import EditWork from './EditWork';
import EditEdu from './EditEdu';
import EditProject from './EditProject';
import EditListItem from './EditListItem';
import EditLanguage from './EditLanguage';

import cv from '../../lib/cv-service';
import content from '../../lib/content-service';
import { withRouter } from "react-router";
import { withAuth } from '../AuthProvider';

import './Content.css'
import auth from '../../lib/auth-service';

class Content extends Component {
  state = {
    selectedTab: '',
    Tasks: 'some tasks',
    editProfile: false,
    work: [],
    editWorkIndex: '',
    newEditWork: false,
    education: [],
    editEduIndex: '',
    newEditEdu: false,
    project: [],
    editProjectIndex: '',
    newEditProject: false,
    interests: [],
    editInterestIndex: '',
    languages: [],
    editLanguageIndex: '',
    softSkills: [],
    editSoftSkillIndex: '',
    hardSkills: [],
    editHardSkillIndex: '',
    isDisplayContent: {
      work:[],
      education:[],
      project:[]
    },
    displayContent: {
      work:[],
      education:[],
      project:[]
    },
  }

  handleTabTitle = () => {
    const { selectedTab } = this.props;
    this.setState({
      selectedTab: selectedTab,
    })
  }

  handleOnChangeDescription = (eventName, value) => {
      this.setState({
        [eventName] : value,
      })
  }

  // Profile Component
  handleEditProfile = () => {
    this.setState({
      editProfile: !this.state.editProfile,
    })
  }

  fetchContentInfo = () => {
    const { cvId } = this.props.match.params;
    cv.getCv(cvId)
      .then(cv => {
        this.props.setCv(cv)
      })
      .then(() => {
        content.getContent(cvId)
          .then(contents => {
            let newWorkArr = [];
            let newEduArr = [];
            let newProjectArr = [];
            const isDisplayContent = {
              work:[],
              education:[],
              project:[],
            };
            const displayContent = {
              work:[],
              education:[],
              project:[],
            };
            console.log('ontents',contents)
            contents.forEach((content,index) => {
              if(content.contentType === 'work') {
                newWorkArr = [...newWorkArr, content];
                isDisplayContent.work[newWorkArr.length-1] = false
                // if(this.props.cv.contentId[index] && this.props.cv.contentId[index].indexOf(content._id) >= 0) isDisplayContent.work[newWorkArr.length-1] = true
                if(this.props.cv.contentId && this.props.cv.contentId.indexOf(content._id) >= 0) {
                  isDisplayContent.work[newWorkArr.length-1] = true
                  displayContent.work[newWorkArr.length-1] = content
                }
              } else if (content.contentType === 'education') {
                newEduArr = [...newEduArr, content];
                isDisplayContent.education[newEduArr.length-1] = false
                // if(this.props.cv.contentId[index] && this.props.cv.contentId.indexOf(content._id) >= 0) isDisplayContent.education[newEduArr.length-1] = true
                if(this.props.cv.contentId && this.props.cv.contentId.indexOf(content._id) >= 0) {
                  isDisplayContent.education[newEduArr.length-1] = true
                  displayContent.education[newEduArr.length-1] = content
                }
              } else if (content.contentType === 'project') {
                newProjectArr = [...newProjectArr, content];
                isDisplayContent.project[newProjectArr.length-1] = false
                // if(this.props.cv.contentId[index] && this.props.cv.contentId.indexOf(content._id) >= 0)  isDisplayContent.project[newProjectArr.length-1] = true
                if(this.props.cv.contentId && this.props.cv.contentId.indexOf(content._id) >= 0) {
                  isDisplayContent.project[newProjectArr.length-1] = true
                  displayContent.project[newProjectArr.length-1] = content
                }
              }
            })
            this.setState({
              work: newWorkArr,
              education: newEduArr,
              project: newProjectArr,
              isDisplayContent: isDisplayContent,
              displayContent,
            })
            this.props.setIsDisplayContent(isDisplayContent)
            this.props.setDisplayContent(displayContent)
            console.log('hohoho')
            console.log(this.state.isDisplayContent)
          })
      })
  }

  getProfile = () => {
    const { editProfile } = this.state;
    if(editProfile) {
      return <EditProfile editProfile={this.handleEditProfile}/>
    } else {
      return <Profile editProfile={this.handleEditProfile} />
    }
  }

  // Work Component
  handleCreateWork = () => {
    const { work } = this.state;
    const { cvId } = this.props.match.params;
    let index = work.length
    content.createContent(this.props.work,cvId)
      .then((data) => {
        this.fetchContentInfo();
        this.setState({
          editWorkIndex: index,
        })
      })
  }

  handleEditWork = (index) => {
    this.setState({
      editWorkIndex: index
    })
  }

  handleUpdateWork = (index) => {
    const { work } = this.state;
    content.updateContent(work[index])
    this.setState({
      editWorkIndex: '',
    })
  }

  handleDeleteWork = (index) => {
    const { work } = this.state;
    content.deleteContent(work[index])
      .then(() => {
        this.fetchContentInfo();
      })
  }

  handleDisplayWork = (index) => {
    console.log('objectjjjjjjj')
    const { isDisplayContent } = this.state;
    isDisplayContent.work[index] = !isDisplayContent.work[index]
    let newObj = isDisplayContent
    this.setState({
      isDisplayContent: newObj,
    })
        this.props.setCv(this.props.cv)

  }

  getWork = () => {
    const { work, editWorkIndex, isDisplayContent} = this.state;
    console.log('this get work',this.props.isDisplayContent.work)
    this.props.displayContent.work = [];
    // debugger
    // this.props.setDisplayContent([])
    return (<div>
        {
          work.map((content,index) => {
            if(this.props.isDisplayContent.work[index]) this.props.displayContent.work = [...this.props.displayContent.work,content]
            console.log('hey',this.props.displayContent)
            // debugger
            // if(this.props.isDisplayContent.work[index]) {
            //   const newArr = [...this.props.displayContent.work,content]
            //   this.props.setDisplayContent
            // }
            if(editWorkIndex === index) {
              return <EditWork
                contentType={'work'}
                key={index}
                work={content}
                index={index}
                updateContent={this.handleUpdateWork}/>
            } else {
              return <Item
                contentType={'work'}
                key={index}
                content={content}
                index={index}
                isUse={isDisplayContent.work[index]}
                useContent={this.handleDisplayWork}
                editContent={this.handleEditWork}
                deleteContent={this.handleDeleteWork}/>
            }
          })
        }
        <button onClick={this.handleCreateWork} ><i className="fas fa-plus-square"></i></button>
        {this.handleUpdateDisplay()}
          {/* {this.props.setDisplayContent(this.props.displayContent)
          } */}
      </div>)
  }

  handleUpdateDisplay = () =>{
    // .then(()=>{
      const newCv =this.props.cv
      newCv.contentId = [];
      console.log('haitteru')
      if(this.props.displayContent.work) {
        this.props.displayContent.work.map((item)=>{
          newCv.contentId = [...newCv.contentId,item._id]
          // newDisplayContact.work = [...newDisplayContact.work,
        })
      }
      if(this.props.displayContent.education) {
        this.props.displayContent.education.map((item)=>{
          newCv.contentId = [...newCv.contentId,item._id]
        })
      }
      if(this.props.displayContent.project) {
        this.props.displayContent.project.map((item)=>{
          newCv.contentId = [...newCv.contentId,item._id]
        })
      }
      cv.updateCv(newCv)
      // .then((data) => {
      //   this.props.setCv(data.cv)
      // })
      // console.log('object')
      // this.props.setDisplayContent(this.state.displayContent)
      // this.props.displayContent.work = this.state.displayContent.work
    // })
    // this.handleAdd()
  }

  handleAdd = () => {
      // 
  }

  //Education Component
  handleCreateEdu = () => {
    const { education } = this.state;
    const { cvId } = this.props.match.params;
    let index = education.length
    content.createContent(this.props.education,cvId)
      .then((data) => {
        this.fetchContentInfo();
        this.setState({
          editEduIndex: index,
        })
      })
  }

  handleEditEdu = (index) => {
    this.setState({
      editEduIndex: index,
    })
  }

  handleUpdateEdu = (index) => {
    const { education } = this.state;
    content.updateContent(education[index])
    this.setState({
      editEduIndex: '',
    })
  }

  handleDeleteEdu = (index) => {
    const { education } = this.state;
    content.deleteContent(education[index])
      .then(() => {
        this.fetchContentInfo();
      })
  }

  handleDisplayEdu = (index) => {
    const { isDisplayContent } = this.state;
    isDisplayContent.education[index] = !isDisplayContent.education[index]
    let newObj = isDisplayContent
    this.setState({
      isDisplayContent: newObj,
    })
    this.props.setCv(this.props.cv)

  }

  getEdu = () => {
    const { education, editEduIndex, isDisplayContent } = this.state;
    this.props.displayContent.education = [];
    return (<div>
        {
          education.map((content,index) => {
            // console.log('hay',this.props.displayContent)
            if(this.props.isDisplayContent.education[index]) this.props.displayContent.education = [...this.props.displayContent.education,content]
            if(editEduIndex === index) {
              return <EditEdu
                contentType={'education'}
                key={index}
                education={content}
                index={index}
                updateContent={this.handleUpdateEdu}/>
            } else {
              return <Item
                contentType={'education'}
                key={index}
                content={content}
                index={index}
                isUse={isDisplayContent.education[index]}
                useContent={this.handleDisplayEdu}
                editContent={this.handleEditEdu}
                deleteContent={this.handleDeleteEdu}/>
            }
         })
        }
        <button onClick={this.handleCreateEdu} ><i className="fas fa-plus-square"></i></button>
        {this.handleUpdateDisplay()}
      </div>)
  }

  // Project Component
  handleCreateProject = () => {
    const { project } = this.state;
    const { cvId } = this.props.match.params;
    let index = project.length
    content.createContent(this.props.project,cvId)
      .then((data) => {
        this.fetchContentInfo();
        this.setState({
          editProjectIndex: index,
        })
      })
  }

  handleEditProject = (index) => {
    this.setState({
      editProjectIndex: index,
    })
  }

  handleUpdateProject = (index) => {
    const { project } = this.state;
    content.updateContent(project[index])
    this.setState({
      editProjectIndex: '',
    })
  }

  handleDeleteProject = (index) => {
    const { project } = this.state;
    content.deleteContent(project[index])
      .then(() => {
        this.fetchContentInfo();
      })
  }

  handleDisplayProject = (index) => {
    const { isDisplayContent } = this.state;
    isDisplayContent.project[index] = !isDisplayContent.project[index]
    let newObj = isDisplayContent
    this.setState({
      isDisplayContent: newObj,
    })
    this.props.setCv(this.props.cv)

  }

  getProject = () => {
    const { project, editProjectIndex, isDisplayContent } = this.state;
    this.props.displayContent.project = [];
    return (<div>
        {
          project.map((content,index) => {
            // console.log('kay',this.props.displayContent)

            if(this.props.isDisplayContent.project[index]) this.props.displayContent.project = [...this.props.displayContent.project,content]
            if(editProjectIndex === index) {
              return <EditProject
                contentType={'project'}
                key={index}
                project={content}
                index={index}
                updateContent={this.handleUpdateProject}/>
            } else {
              return <Item
                contentType={'project'}
                key={index}
                content={content}
                index={index}
                isUse={isDisplayContent.project[index]}
                useContent={this.handleDisplayProject}
                editContent={this.handleEditProject}
                deleteContent={this.handleDeleteProject}/>
            }
         })
        }
        <button onClick={this.handleCreateProject} ><i className="fas fa-plus-square"></i></button>
        {this.handleUpdateDisplay()}
      </div>)
  }

  // Interests
  handleCreateInterest = () => {
    const { interests } = this.state;
    const newInterests = [...interests, 'text2']
    this.updateInterestInfo(newInterests);
  }

  handleEditInterest = (index) => {
    this.setState({
      editInterestIndex: index,
    })
  }

  handleUpdateInterest = (index, editInput) => {
    const { interests } = this.state;
    const newInterests = [...interests]
    newInterests[index] = editInput;
    this.updateInterestInfo(newInterests);
  }

  handleDeleteInterest = (index) => {
    const { interests } = this.state;
    const newInterests = [...interests]
    newInterests.splice(index,1)
    this.updateInterestInfo(newInterests);
  }

  updateInterestInfo = (newInterests) => {
    const newUser = {...this.props.user, interests: newInterests}
    this.props.setUser(newUser)
    auth.updateUser(newUser)
      .then(()=>{
        this.setState({
          interests: this.props.user.interests,
          editInterestIndex: '',

        })
      })
  }

  getInterests = () => {
    const { interests, editInterestIndex } = this.state;
    return (
      <article className="ineterest-list">
        {
          interests.map((interest,index) => {
            if (editInterestIndex === index) {
              return <EditListItem
                itemType='interest'
                key={index}
                index={index}
                listContent={interest}
                updateListItem={this.handleUpdateInterest} />
            } else {
              return <ListItem
                itemType='interest'
                key={index}
                index={index}
                listContent={interest}
                upListItem={this.handleUpInterest}
                downListItem={this.handleDownInterest}
                editListItem={this.handleEditInterest}
                deleteListItem={this.handleDeleteInterest} />
            }
          })
        }
        <button onClick={this.handleCreateInterest} ><i className="fas fa-plus-square"></i></button>
      </article>
    )
  }

  // Languages
  handleCreateLanguage = () => {
    const { languages } = this.state;
    const newLanguages = [...languages, {language:'Japanese', level:'Native'}]
    this.updateLanguageInfo(newLanguages)
  }

  handleUpdateLanguage = (index, editLanguageInput, editLevelInput) => {
    const { languages } = this.state;
    const newLanguages = [...languages]
    newLanguages[index].language = editLanguageInput;
    newLanguages[index].level = editLevelInput;
    this.updateLanguageInfo(newLanguages)
  }

  handleEditLanguage = (index) => {
    this.setState({
      editLanguageIndex: index,
    })
  }

  handleDeleteLanguage = (index) => {
    const { languages } = this.state;
    const newLanguages = [...languages]
    newLanguages.splice(index,1)
    this.updateLanguageInfo(newLanguages)
  }

  updateLanguageInfo = (newLanguages) => {
    const newUser = {...this.props.user, languages: newLanguages}
    this.props.setUser(newUser)
    auth.updateUser(newUser)
      .then(()=>{
        this.setState({
          editLanguageIndex: '',
          languages: this.props.user.languages
        })
      })
  }

  getLanguages = () => {
    const { languages, editLanguageIndex } = this.state;
    return (
      <article className="language-list">
        {
          languages.map((languages,index) => {
            if (editLanguageIndex === index) {
              return <EditLanguage
                itemType='language'
                key={index}
                index={index}
                listContent={languages}
                updateLanguage={this.handleUpdateLanguage} />
            } else {
              return <Language
                key={index}
                index={index}
                listContent={languages}
                upLanguage={this.handleUpLanguage}
                downLanguage={this.handleDownLanguage}
                editLanguage={this.handleEditLanguage}
                deleteLanguage={this.handleDeleteLanguage} />
            }
          })
        }
        <button onClick={this.handleCreateLanguage} ><i className="fas fa-plus-square"></i></button>
      </article>
    )
  }

  // Skill
  // soft skill
  handleCreateSoftSkill = () => {
    const { softSkills } = this.state;
    const newSoftSkills = [...softSkills, 'new skill']
    this.updateSoftSkillInfo(newSoftSkills)
  }

  updateSoftSkillInfo = (newSoftSkills) => {
    const newUser = {...this.props.user, softSkills: newSoftSkills}
    this.props.setUser(newUser)
    auth.updateUser(newUser)
      .then(()=>{
        this.setState({
          editSoftSkillIndex: '',
          softSkills: this.props.user.softSkills
        })
      })
  }

  handleUpdateSoftSkill = (index, editInput) => {
    const { softSkills } = this.state;
    const newSoftSkills = [...softSkills]
    newSoftSkills[index] = editInput;
    this.updateSoftSkillInfo(newSoftSkills);
  }

  handleEditSoftSkill = (index) => {
    this.setState({
      editSoftSkillIndex: index,
    })
  }

  handleDeleteSoftSkill = (index) => {
    const { softSkills } = this.state;
    const newSoftSkills = [...softSkills]
    newSoftSkills.splice(index,1)
    this.updateSoftSkillInfo(newSoftSkills)
  }

  // hard skill
  handleCreateHardSkill = () => {
    const { hardSkills } = this.state;
    const newHardSkills = [...hardSkills, 'new skill']
    this.updateHardSkillInfo(newHardSkills)
  }

  updateHardSkillInfo = (newHardSkills) => {
    const newUser = {...this.props.user, hardSkills: newHardSkills}
    this.props.setUser(newUser)
    auth.updateUser(newUser)
      .then(()=>{
        this.setState({
          editHardSkillIndex: '',
          hardSkills: this.props.user.hardSkills
        })
      })
  }

  handleUpdateHardSkill = (index, editInput) => {
    const { hardSkills } = this.state;
    const newHardSkills = [...hardSkills]
    newHardSkills[index] = editInput;
    this.updateHardSkillInfo(newHardSkills);
  }

  handleEditHardSkill = (index) => {
    this.setState({
      editHardSkillIndex: index,
    })
  }

  handleDeleteHardSkill = (index) => {
    const { hardSkills } = this.state;
    const newHardSkills = [...hardSkills]
    newHardSkills.splice(index,1)
    this.updateHardSkillInfo(newHardSkills)
  }

  getSkill = () => {
    const { hardSkills, editHardSkillIndex, softSkills, editSoftSkillIndex } = this.state;
    return (
      <article className="skill-list">
        <div className="soft-skill-container">
          <p>Soft Skill</p>
          {
            softSkills.map((softSkill,index) => {
              if (editSoftSkillIndex === index) {
                return <EditListItem
                  itemType='softSkill'
                  key={index}
                  index={index}
                  listContent={softSkill}
                  updateListItem={this.handleUpdateSoftSkill} />
              } else {
                return <ListItem
                  itemType='softSkill'
                  key={index}
                  index={index}
                  listContent={softSkill}
                  upListItem={this.handleUpSoftSkill}
                  downListItem={this.handleDownSoftSkill}
                  editListItem={this.handleEditSoftSkill}
                  deleteListItem={this.handleDeleteSoftSkill} />
              }
            })
          }
          <button onClick={this.handleCreateSoftSkill} ><i className="fas fa-plus-square"></i></button>
        </div>
        <div className="hard-skill-container">
          <p>Hard Skill</p>
          {
            hardSkills.map((hardSkill,index) => {
              if (editHardSkillIndex === index) {
                return <EditListItem
                  itemType='hardSkill'
                  key={index}
                  index={index}
                  listContent={hardSkill}
                  updateListItem={this.handleUpdateHardSkill} />
              } else {
                return <ListItem
                  itemType='hardSkill'
                  key={index}
                  index={index}
                  listContent={hardSkill}
                  upListItem={this.handleUpHardSkill}
                  downListItem={this.handleDownHardSkill}
                  editListItem={this.handleEditHardSkill}
                  deleteListItem={this.handleDeleteHardSkill} />
              }
            })
          }
          <button onClick={this.handleCreateHardSkill} ><i className="fas fa-plus-square"></i></button>
        </div>
      </article>
    )
  }

  fetchUserInfo = () => {
    auth.getUser()
    .then((user) => {
      this.props.setUser(user)
      this.setState({
        interests: this.props.user.interests,
        languages: this.props.user.languages,
        softSkills: this.props.user.softSkills,
        hardSkills: this.props.user.hardSkills,
      })
    })
  }

  componentDidMount() {
    this.fetchContentInfo()
    this.fetchUserInfo()
    const newObj = this.props.displayContent
    this.setState({
      displayContent: this.props.displayContent
    })
    this.props.setDisplayContent(this.state.displayContent)
     console.log('irukai?',this.props)
  }

  render() {
    console.log('render',)

    const { selectedTab } = this.props;
    if (selectedTab === 'profile') {
      return this.getProfile()
    } else if (selectedTab === 'work') {
      return this.getWork()
    } else if (selectedTab === 'education') {
      return this.getEdu()
    } else if (selectedTab === 'skills') {
      return this.getSkill()
    } else if (selectedTab === 'project') {
      return this.getProject()
    } else if (selectedTab === 'languages') {
      return this.getLanguages()
    } else if  (selectedTab === 'interests') {
      return this.getInterests()
    }
  }
}

export default withAuth()(withRouter(Content));
