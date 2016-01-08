<?php

namespace AppBundle\Provider;

use AppBundle\Entity\Computation;
use AppBundle\Repository\ComputationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Hashids\HashGenerator;
use Ratchet\ConnectionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Util\SecureRandom;

/**
 * Class ComputationProvider
 * @package AppBundle\Provider
 */
class ComputationProvider
{

    /**
     * @var ComputationRepository
     */
    private $computationRepository;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->computationRepository = $entityManager->getRepository('AppBundle:Computation');
    }

    /**
     * @return Computation
     */
    public function createComputation()
    {
        $computation = new Computation();

        $dateTime = new \DateTime();

        $computation
            ->setTimestamp($dateTime)
        ;

        return $computation;
    }

    /**
     * @param $hashId
     * @return null|Computation
     */
    public function findComputationByHashId($hashId)
    {
        $computation = $this->computationRepository->findOneBy([
            "hashId" => $hashId
        ]);

        if (!$computation) {
            throw new NotFoundHttpException();
        }

        // TODO: Put in Redis

        return $computation;
    }
}
