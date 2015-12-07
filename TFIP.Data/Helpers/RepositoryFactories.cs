using System;
using System.Collections.Generic;
using System.Data.Entity;
using TFIP.Business.Entities;
using TFIP.Data.Contracts;
using TFIP.Data.Repositories;

namespace TFIP.Data.Helpers
{
    public class RepositoryFactories
    {
        /// <summary>
        /// Return the runtime repository factory functions,
        /// each one is a factory for a repository of a particular type.
        /// </summary>
        private IDictionary<Type, Func<DbContext, object>> GetFactories()
        {
            return new Dictionary<Type, Func<DbContext, object>>
                {
                   // {typeof(ISomeRepository), dbContext => new SomeRepository(dbContext)},
                   {typeof(IClientRepository<IndividualClient>), creditDbContext => new ClientRepository<IndividualClient>(creditDbContext)},
                   {typeof(IClientRepository<JuridicalClient>), creditDbContext => new ClientRepository<JuridicalClient>(creditDbContext)},
                   {typeof(ICreditRequestRepository), creditDbContext => new CreditRequestRepository(creditDbContext)}
                };
        }

        /// <summary>
        /// Constructor that initializes with an arbitrary collection of factories
        /// </summary>
        public RepositoryFactories()
        {
            Factories = GetFactories();
        }

        /// <summary>
        /// Get the repository factory function for the type.
        /// </summary>
        /// <typeparam name="T">Type serving as the repository factory lookup key.</typeparam>
        /// <returns>The repository function if found, else null.</returns>
        /// <remarks>
        /// The type parameter, T, is typically the repository type 
        /// but could be any type (e.g., an entity type)
        /// </remarks>
        public Func<DbContext, object> GetRepositoryFactory<T>()
        {
            Func<DbContext, object> factory;
            Factories.TryGetValue(typeof(T), out factory);
            return factory;
        }

        /// <summary>
        /// Get the factory for <see cref="IBaseRepository{T}"/> where T is an entity type.
        /// </summary>
        /// <typeparam name="T">The root type of the repository, typically an entity type.</typeparam>
        /// <returns>
        /// A factory that creates the <see cref="IBaseRepository{T}"/>, given an EF <see cref="DbContext"/>.
        /// </returns>
        /// <remarks>
        /// Looks first for a custom factory in <see cref="Factories"/>.
        /// If not, falls back to the <see cref="DefaultEntityRepositoryFactory{T}"/>.
        /// You can substitute an alternative factory for the default one by adding
        /// a repository factory for type "T" to <see cref="Factories"/>.
        /// </remarks>
        public Func<DbContext, object> GetRepositoryFactoryForEntityType<T>() where T : class, IEntity
        {
            return GetRepositoryFactory<T>() ?? DefaultEntityRepositoryFactory<T>();
        }

        /// <summary>
        /// Default factory for a <see cref="IBaseRepository{T}"/> where T is an entity.
        /// </summary>
        /// <typeparam name="T">Type of the repository's root entity</typeparam>
        protected virtual Func<DbContext, object> DefaultEntityRepositoryFactory<T>() where T : class, IEntity
        {
            return dbContext => new BaseRepository<T>(dbContext);
        }

        /// <summary>
        /// Get the dictionary of repository factory functions.
        /// </summary>
        /// <remarks>
        /// A dictionary key is a System.Type, typically a repository type.
        /// A value is a repository factory function
        /// that takes a <see cref="DbContext"/> argument and returns
        /// a repository object. Caller must know how to cast it.
        /// </remarks>
        protected IDictionary<Type, Func<DbContext, object>> Factories;
    }
}
