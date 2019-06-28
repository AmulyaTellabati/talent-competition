using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;
using static System.Net.Mime.MediaTypeNames;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            try {
                User profile = null;
                profile = (await _userRepository.GetByIdAsync(Id));
                if(profile != null)
                {
                    var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();
                    var languages = profile.Languages.Select(x => ViewModelFromLanguage(x)).ToList();
                    var experiences = profile.Experience.Select(x => ViewModelFromExperience(x)).ToList();
                    var result = new TalentProfileViewModel
                    {
                        Id=profile.Id,
                        Address = profile.Address,
                        LinkedAccounts=profile.LinkedAccounts,
                        FirstName=profile.FirstName,
                        LastName=profile.LastName,
                        Nationality=profile.Nationality,
                        Email=profile.Email,
                        Phone=profile.Phone,
                        Languages=languages,
                        Skills=skills,
                        Summary=profile.Summary,
                        Description=profile.Description,
                        ProfilePhoto=profile.ProfilePhoto,
                        ProfilePhotoUrl=profile.ProfilePhotoUrl,
                        VisaStatus=profile.VisaStatus,
                        VisaExpiryDate=profile.VisaExpiryDate,
                        JobSeekingStatus=profile.JobSeekingStatus,
                        Experience=experiences



                    };
                    return result;
                }
                return null;
            }
            catch (Exception e) { return null; }
            //Your code here;
            //throw new NotImplementedException();
        }

        private ExperienceViewModel ViewModelFromExperience(UserExperience x)
        {
            return new ExperienceViewModel {
                Id=x.Id,
                Company=x.Company,
                Position=x.Position,
                Responsibilities=x.Responsibilities,
                Start=x.Start,
                End=x.End
            };
        }

        private AddLanguageViewModel ViewModelFromLanguage(UserLanguage x)
        {
            return new AddLanguageViewModel
            {
                Id = x.Id,
                Level = x.LanguageLevel,
                Name = x.Language
            };
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            try {
                if (updaterId != null) {
                    User existingUser = (await _userRepository.GetByIdAsync(model.Id));
                    existingUser.Address = model.Address;
                    existingUser.LinkedAccounts = model.LinkedAccounts;
                    existingUser.Phone = model.Phone;
                    existingUser.Email = model.Email;
                    existingUser.FirstName = model.FirstName;
                    existingUser.LastName = model.LastName;
                    existingUser.Nationality = model.Nationality;
                    existingUser.Summary = model.Summary;
                    existingUser.Description = model.Description;
                    existingUser.VisaStatus = model.VisaStatus;
                    existingUser.VisaExpiryDate = model.VisaExpiryDate;
                    existingUser.ProfilePhoto = model.ProfilePhoto;
                    existingUser.ProfilePhotoUrl = model.ProfilePhotoUrl;
                    existingUser.JobSeekingStatus= model.JobSeekingStatus;

                    if (model.Languages != null)
                    {
                        var newLanguage = new List<UserLanguage>();
                        foreach (var lang in model.Languages)
                        {
                            var Language = existingUser.Languages.SingleOrDefault(x => x.Id == lang.Id);
                            if (Language == null)
                            {
                                Language = new UserLanguage
                                {
                                    Id = ObjectId.GenerateNewId().ToString(),
                                    //Language=lang.Name,
                                    //LanguageLevel=lang.Level,
                                    UserId=updaterId,
                                    IsDeleted = false
                                };
                            }
                            UpdateLangFromView(lang,Language);
                            newLanguage.Add(Language);

                        }
                        existingUser.Languages = newLanguage;
                    }
                    if (model.Skills != null)
                    {
                        var newSkills = new List<UserSkill>();
                        foreach (var item in model.Skills)
                        {
                            var skill = existingUser.Skills.SingleOrDefault(x => x.Id == item.Id);
                            if (skill == null)
                            {
                                skill = new UserSkill
                                {
                                    Id = ObjectId.GenerateNewId().ToString(),
                                    IsDeleted = false
                                };
                            }
                            UpdateSkillFromView(item, skill);
                            newSkills.Add(skill);
                        }
                        existingUser.Skills = newSkills;

                    }
                    if (model.Experience != null)
                    {
                        var newExperience = new List<UserExperience>();
                        foreach (var item in model.Experience)
                        {
                            var Exp = existingUser.Experience.SingleOrDefault(x => x.Id == item.Id);
                            if (Exp == null)
                            {
                                Exp = new UserExperience
                                {
                                    Id = ObjectId.GenerateNewId().ToString()
                                     
                                };
                            }
                            UpdateExperienceFromView(item, Exp);
                            newExperience.Add(Exp);
                        }
                        existingUser.Experience = newExperience;

                    }

                    await _userRepository.Update(existingUser);

                }


                return true;
            }
            catch (Exception e) { return false; }
            //Your code here;
            //throw new NotImplementedException();
        }

        private void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {

            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    //await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;

            //var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();
            //string newFileName;
            //try
            //{
            //    var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
            //    newFileName = Guid.NewGuid().ToString() + extension; //Create a new Name 
            //                                                      //for the file due to security reasons.
            //    var path = Path.Combine(Directory.GetCurrentDirectory(), "images", newFileName);

            //    using (var bits = new FileStream(path, FileMode.Create))
            //    {
            //        await file.CopyToAsync(bits);
            //    }

            //    if (!string.IsNullOrWhiteSpace(newFileName))
            //    {                
            //        profile.ProfilePhoto = newFileName;
            //        profile.ProfilePhotoUrl = path;

            //        await _userRepository.Update(profile);
            //        return true;
            //    }
            //}
            //catch (Exception e)
            //{
            //    return false;
            //}

            //return true;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        #endregion

        protected void UpdateLangFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
            
        }


        #endregion
        //protected AddLanguageViewModel ViewModelFromLang(UserLanguage language)
        //{
        //    return new AddLanguageViewModel
        //    {
        //        Id = language.Id,
        //        Level = language.LanguageLevel,
        //        Name = language.Language,
        //        CurrentUserId=language.UserId
        //    };
        //}

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
