using System;
using System.Data.Entity;
using System.Linq;
using TFIP.Business.Entities;
using TFIP.Data.Contracts;

namespace TFIP.Data.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class, IEntity
    {
        public BaseRepository(DbContext dbContext)
        {
            if (dbContext == null)
            {
                throw new ArgumentNullException("dbContext");
            }

            DbContext = dbContext;
        }

        protected DbContext DbContext { get; set; }

        protected IDbSet<T> DbSet
        {
            get { return DbContext.Set<T>(); }
        }

        #region IBaseRepository<T> Members
        /// <summary>
        /// Gets all the entities of type T
        /// </summary>
        /// <returns>Result set of all the entities</returns>
        public virtual IQueryable<T> All()
        {
            return DbSet;
        }

        /// <summary>
        /// Gets entity from repository by id.
        /// </summary>
        /// <param name="id">System identifier of entity in application.</param>
        /// <returns>Returns loaded entity or null.</returns>
        public virtual T GetById(long id)
        {
            return DbSet.Find(id);
        }

        /// <summary>
        /// Saves entity in the repository.
        /// </summary>
        /// <param name="entity">Entity to save.</param>
        public virtual void InsertOrUpdate(T entity, bool startTrackProperties = false)
        {
            if (IsNew(entity))
            {
                DbSet.Add(entity);
            }

            AttachForUpdate(entity, startTrackProperties);
        }

        /// <summary>
        /// Deletes entity from repository.
        /// </summary>
        /// <param name="entity">Entity to delete.</param>
        public virtual void Delete(T entity)
        {
            DbSet.Attach(entity);
            DbContext.Entry(entity).State = EntityState.Deleted;
            DbSet.Remove(entity);
        }

        /// <summary>
        /// Deletes entity by mathing id.
        /// </summary>
        /// <param name="id"></param>
        public virtual void Delete(long id)
        {
            DbSet.Remove(GetById(id));
        }
        #endregion

        /// <summary>
        /// Attaches entity to context and marks it as updated for EF to update.
        /// </summary>
        /// <param name="entity">Entity to attach.</param>
        /// <typeparam name="T">Type of entity to attach.</typeparam>
        protected void AttachForUpdate(T entity, bool startTrackProperties)
        {
            if (IsNew(entity))
            {
                return;
            }

            if (!IsAttached(entity))
            {
                DbContext.Set<T>().Attach(entity);
                if (!startTrackProperties)
                {
                    DbContext.Entry(entity).State = EntityState.Modified;
                }
            }
        }

        /// <summary>
        /// Checks if entity is new.
        /// </summary>
        /// <param name="entity">Entity to check.</param>
        /// <typeparam name="T">Type of entity to attach.</typeparam>
        /// <returns>Returns a value indicating whether provided entity is new (not added previously).</returns>
        protected bool IsNew(T entity)
        {
            return entity.Id == 0;
        }

        /// <summary>
        /// Checks if entity already attached.
        /// </summary>
        /// <permission cref="System.Security.PermissionSet">public</permission>
        /// <param name="entity">Entity to check.</param>
        /// <typeparam name="T">Entity type.</typeparam>
        /// <returns>A value indicating whether entity already attached.</returns>
        protected bool IsAttached(T entity)
        {
            return DbContext.Set<T>().Local.Contains(entity);
        }
    }
}
