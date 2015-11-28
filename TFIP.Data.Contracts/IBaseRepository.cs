using System;
using System.Linq;
using System.Linq.Expressions;
using TFIP.Business.Entities;

namespace TFIP.Data.Contracts
{
    public interface IBaseRepository<T> where T: class, IEntity
    {
        /// <summary>
        /// Gets all the entities of type T
        /// </summary>
        /// <returns>Result set of all the entities</returns>
        IQueryable<T> All();

        /// <summary>
        /// Gets entity from repository by id.
        /// </summary>
        /// <param name="id">System identifier of entity in application.</param>
        /// <returns>Returns loaded entity or null.</returns>
        T GetById(long id);

        /// <summary>
        /// Saves entity in the repository.
        /// </summary>
        /// <param name="entity">Entity to save.</param>
        /// <param name="startTrackProperties">startTrackProperty</param>
        void InsertOrUpdate(T entity, bool startTrackProperties = false);

        /// <summary>
        /// Deletes entity from repository.
        /// </summary>
        /// <param name="entity">Entity to delete.</param>
        void Delete(T entity);

        /// <summary>
        /// Deletes entity by mathing id.
        /// </summary>
        /// <param name="id"></param>
        void Delete(long id);

        IQueryable<T> Get(Expression<Func<T, bool>> filter);
    }
}
