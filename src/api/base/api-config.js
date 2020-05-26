import Api from '^'
import { version } from 'core-js'

const merge = require('webpack-merge')

const M_BASE_PATH = Api.path.base

const baseApi = {
  getSidebarNavMenuOfConfig: ('/static/configs/sidebar-menu.json'),
  getSideBarMenu: (M_BASE_PATH.concat('navigation/all')),
  echartsConfig: ('/static/mock-data/walden.project.json'),
  user: {
    login: (M_BASE_PATH.concat('user/login'))
  },
  // ------ user center --------
  userCenter: {
    findAdmins: (M_BASE_PATH.concat('admin')),
    organizationTrees: (M_BASE_PATH.concat('organizationTrees')),
    createOrganization: (M_BASE_PATH.concat('organization')),
    createAdmin: (M_BASE_PATH.concat('admin')),
    modifyOrganization: (M_BASE_PATH.concat('organization/')),
    deleteOrganization: (M_BASE_PATH.concat('organization/')),
    modifyAdmin: (M_BASE_PATH.concat('admin/')),
    deleteAdmin: (M_BASE_PATH.concat('admin/'))
  },
  dataCenter: {
    getDataCenter: (M_BASE_PATH.concat('resource/type')),
    getResourceList: (M_BASE_PATH.concat('resource/list')),
    deleteResource: (M_BASE_PATH.concat('resource/')),
    addResource: (M_BASE_PATH.concat('resource')),
    createType: (M_BASE_PATH.concat('resource/type'))
  },
  powerCenter: {
    createRole: (M_BASE_PATH.concat('permission/role')),
    getRole: (M_BASE_PATH.concat('permission/role')),
    getPermissionList: (M_BASE_PATH.concat('permission/list')),
    deleteRole: (M_BASE_PATH.concat('permission/role/')),
    modifyRole: (M_BASE_PATH.concat('permission/role/')),
    modifyPermission: (M_BASE_PATH.concat('permission/')),
    deletePermission: (M_BASE_PATH.concat('permission/')),
    createPermission: (M_BASE_PATH.concat('permission'))
  },
  rootCenter: {
    getMetadataType: (M_BASE_PATH.concat('metedata/type')),
    metadataList: (M_BASE_PATH.concat('metedata/list')),
    operatingMetadata: (M_BASE_PATH.concat('metedata/modify/')),
    createMetadataType: (M_BASE_PATH.concat('metedata/type')),
    operatingMetadataType: (M_BASE_PATH.concat('metedata/type/modify/')),
    deleteMetadataType: (M_BASE_PATH.concat('metedata/type/delete/')),
    createMetadata: (M_BASE_PATH.concat('metedata')),
    deleteMetadata: (M_BASE_PATH.concat('metedata/delete/'))
  },
  areaCenter: {
    findAreas: (M_BASE_PATH.concat('areas')),
    findTerritories: (M_BASE_PATH.concat('territories')),
    createArea: (M_BASE_PATH.concat('area')),
    modifyArea: (M_BASE_PATH.concat('area/')),
    deleteArea: (M_BASE_PATH.concat('area/')),
    findRegions: (M_BASE_PATH.concat('regions')),
    deleteTerritory: (M_BASE_PATH.concat('territory/')),
    createTerritory: (M_BASE_PATH.concat('territory')),
    modifyTerritory: (M_BASE_PATH.concat('territory/'))
  },
  groupsCenter: {
    getGroups: (M_BASE_PATH.concat('checkup_groups')),
    getTerms: (M_BASE_PATH.concat('checkup_terms/')),
    createGroup: (M_BASE_PATH.concat('checkup_group')),
    modifyGroup: (M_BASE_PATH.concat('checkup_group/')),
    deleteGroup: (M_BASE_PATH.concat('checkup_group/')),
    searchTerms: (M_BASE_PATH.concat('checkup_terms/search')),
    modifyTerm: (M_BASE_PATH.concat('checkup_term/')),
    createTerm: (M_BASE_PATH.concat('checkup_term')),
    deleteTerm: (M_BASE_PATH.concat('checkup_term/'))
  },
  questionCenter: {
    getQuestionnaires: (M_BASE_PATH.concat('questionnaires')),
    getSubjects: (M_BASE_PATH.concat('subjects/')),
    createQuestionnaire: (M_BASE_PATH.concat('questionnaire')),
    modifyQuestionnaire: (M_BASE_PATH.concat('questionnaire/')),
    deleteQuestionnaire: (M_BASE_PATH.concat('questionnaire/')),
    modifySubject: (M_BASE_PATH.concat('subject/')),
    searchSubjects: (M_BASE_PATH.concat('subjects/search')),
    createSubject: (M_BASE_PATH.concat('subject')),
    deleteSubject: (M_BASE_PATH.concat('subject/'))
  },
  versionCenter: {
    getInterventionVersion: (M_BASE_PATH.concat('intervention/version')),
    getInterventions: (M_BASE_PATH.concat('intervention')),
    createInterventionVersion: (M_BASE_PATH.concat('intervention/version')),
    modifyInterventionVersion: (M_BASE_PATH.concat('intervention/version/')),
    deleteInterventionVersion: (M_BASE_PATH.concat('intervention/version/')),
    modifyIntervention: (M_BASE_PATH.concat('intervention/')),
    createIntervention: (M_BASE_PATH.concat('intervention')),
    deleteIntervention: (M_BASE_PATH.concat('intervention/'))
  },
  couponCenter: {
    getCouponTypes: (M_BASE_PATH.concat('couponTypes')),
    getCoupons: (M_BASE_PATH.concat('coupons')),
    createCouponType: (M_BASE_PATH.concat('couponType')),
    modifyCouponType: (M_BASE_PATH.concat('couponType/')),
    deleteCouponType: (M_BASE_PATH.concat('couponType/')),
    modifyCoupon: (M_BASE_PATH.concat('coupon/')),
    searchCoupon: (M_BASE_PATH.concat('coupon/search'))
  },
  school: {
    findSchools: (M_BASE_PATH.concat('schools')),
    searchSchools: (M_BASE_PATH.concat('schools/search')),
    deleteSchool: (M_BASE_PATH.concat('school/')),
    createSchool: (M_BASE_PATH.concat('school')),
    modifySchool: (M_BASE_PATH.concat('school/'))
  },
  hospital: {
    findHospitals: (M_BASE_PATH.concat('hospitals')),
    searchHospitals: (M_BASE_PATH.concat('hospitals/search')),
    deleteHospital: (M_BASE_PATH.concat('hospital/')),
    createHospital: (M_BASE_PATH.concat('hospital')),
    modifyHospital: (M_BASE_PATH.concat('hospital/'))
  },
  children: {
    listChild: (M_BASE_PATH.concat('childs')),
    listAllSchool: (M_BASE_PATH.concat('schools/all'))
  },
  commissioner: {
    findDoctors: (M_BASE_PATH.concat('doctors')),
    searchDoctors: (M_BASE_PATH.concat('doctors/search')),
    createDoctor: (M_BASE_PATH.concat('doctor')),
    deleteDoctor: (M_BASE_PATH.concat('doctor/')),
    modifyDoctor: (M_BASE_PATH.concat('doctor/'))
  },
  smallRoom: {
    findRooms: (M_BASE_PATH.concat('rooms')),
    searchRooms: (M_BASE_PATH.concat('rooms/search')),
    createRoom: (M_BASE_PATH.concat('room')),
    deleteRoom: (M_BASE_PATH.concat('room/')),
    modifyRoom: (M_BASE_PATH.concat('room/'))
  },
  task: {
    surveyMissionList: (M_BASE_PATH.concat('survey/list')),
    modifySurveyMission: (M_BASE_PATH.concat('survey/')),
    getAllCoupons: (M_BASE_PATH.concat('coupons/all')),
    findSchoolsByArea: (M_BASE_PATH.concat('schools/area')),
    findDoctorsByArea: (M_BASE_PATH.concat('doctors/area')),
    createSurveyMission: (M_BASE_PATH.concat('survey')),
    deleteMission: (M_BASE_PATH.concat('survey/'))
  },
  survey_result: {
    surveyStudentStatistics: (M_BASE_PATH.concat('operation/'))
  },
  content: {
    findColumns: (M_BASE_PATH.concat('column')),
    articleList: (M_BASE_PATH.concat('articles/column')),
    getSts: (M_BASE_PATH.concat('sts')),
    modifyArticle: (M_BASE_PATH.concat('article/'))
  },
  errorStore: {
    getLogs: (M_BASE_PATH.concat('logs/getLogs'))
  }

}

export default merge(baseApi, Api.api)
