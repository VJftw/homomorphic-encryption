<?php

namespace AppBundle\Manager;
use AppBundle\Entity\Computation;
use AppBundle\Service\RedisService;
use Doctrine\ORM\EntityManagerInterface;
use Snc\RedisBundle\Client\Phpredis\Client;


/**
 * Class ComputationManager
 * @package AppBundle\Manager
 */
class ComputationManager
{

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var RedisService
     */
    private $redisService;

    /**
     * @param EntityManagerInterface $entityManager
     * @param RedisService $redisService
     */
    public function __construct(EntityManagerInterface $entityManager, RedisService $redisService)
    {
        $this->entityManager = $entityManager;

        $this->redisService = $redisService;
    }

    /**
     * @param Computation $computation
     *
     * @return Computation
     */
    public function save(Computation $computation)
    {
        $this->entityManager->persist($computation);

        $this->entityManager->flush();

        $this->redisService->set(
            $computation->getHashId(),
            $computation
        );

        return $computation;
    }
}
